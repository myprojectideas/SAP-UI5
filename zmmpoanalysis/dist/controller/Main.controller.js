sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/MessageToast',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox',
	'sap/ui/core/Fragment',
	'zmmpoanalysis/zmmpoanalysis/model/formatter',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Token",
	'zmmpoanalysis/zmmpoanalysis/js/xlsx'
], function(Controller, MessageToast, JSONModel, MessageBox, Fragment, formatter, Filter, FilterOperator, Token) {
	"use strict";

	return Controller.extend("zmmpoanalysis.zmmpoanalysis.controller.Main", {
		formatter: formatter,
		onInit: function() {
			this._mDialogs = {};
			sap.ui.core.BusyIndicator.show();
			this.bindHeaderTable();
			this.getOwnerComponent().getModel("AppConfig").setProperty("/Supplier", "");
			console.log("ver 1.10");
		},

		onResetFitler: function(oEvent) {
			this.bindHeaderTable();
			this.byId("idNB1").setSelected(true);
			this.byId("idZNB1").setSelected(true);
			this.getOwnerComponent().getModel("AppConfig").setProperty("/Supplier", "");
			this.byId("multiInput1").setTokens([]);
		},

		handleConfirm: function(oEvent) {
			var oFilter, aFilter = [];
			var that = this;
			var yyyy, mm, dd;
			var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
			sap.ui.core.BusyIndicator.show();
			// For Date Range
			var dateCreatedOnFrom = oEvent.getSource().getFilterItems()[0].getCustomControl().getFrom();
			var dateCreatedOnTo = oEvent.getSource().getFilterItems()[0].getCustomControl().getTo();
			if (dateCreatedOnFrom && dateCreatedOnTo) {
				yyyy = dateCreatedOnFrom.getFullYear().toString();
				mm = dateCreatedOnFrom.getMonth() + 1;
				if (mm < 10 && mm > 0) {
					mm = '0' + mm.toString();
				} else {
					mm = mm.toString();
				}
				dd = dateCreatedOnFrom.getDate();
				if (dd < 10 && dd > 0) {
					dd = '0' + dd.toString();
				} else {
					dd = dd.toString();
				}
				dateCreatedOnFrom = yyyy + mm + dd;
				yyyy = dateCreatedOnTo.getFullYear().toString();
				mm = dateCreatedOnTo.getMonth() + 1;
				if (mm < 10 && mm > 0) {
					mm = '0' + mm.toString();
				} else {
					mm = mm.toString();
				}
				dd = dateCreatedOnTo.getDate();
				if (dd < 10 && dd > 0) {
					dd = '0' + dd.toString();
				} else {
					dd = dd.toString();
				}
				dateCreatedOnTo = yyyy + mm + dd;
				oFilter = new sap.ui.model.Filter("CreatedOn", FilterOperator.BT, dateCreatedOnFrom, dateCreatedOnTo);
				aFilter.push(oFilter);
			} else {
				// Current Date in yyyymmdd format
				var x = new Date();
				var y = x.getFullYear().toString();
				var m = (x.getMonth() + 1);
				if (m < 10 && m > 0) {
					m = '0' + m.toString();
				} else {
					m = m.toString();
				}
				var d = x.getDate();
				if (d < 10 && d > 0) {
					d = '0' + d.toString();
				} else {
					d = d.toString();
				}
				// (d.length == 1) && (d = '0' + d);
				// (m.length == 1) && (m = '0' + m);
				var yyyymmdd = y + m + d;
				// Set Filter Intital Values
				var dateValue = new Date();
				this.getOwnerComponent().getModel("AppConfig").setProperty("/fromDateValue", dateValue);
				this.getOwnerComponent().getModel("AppConfig").setProperty("/toDateValue", dateValue);
				// oFilter
				oFilter = new sap.ui.model.Filter("CreatedOn", FilterOperator.BT, yyyymmdd, yyyymmdd);
				aFilter.push(oFilter);
			}
			// for Supplier
			var Supplier = this.getOwnerComponent().getModel("AppConfig").getProperty("/Supplier");
			if (Supplier) {
				oFilter = new sap.ui.model.Filter("Supplier", 'EQ', Supplier);
				aFilter.push(oFilter);
			}

			// for PO Number
			var tokens = oEvent.getSource().getFilterItems()[2].getCustomControl().getTokens();
			tokens.forEach(function(temp) {
				oFilter = new sap.ui.model.Filter("PurchaseOrder", 'EQ', temp.getKey());
				aFilter.push(oFilter);
			});
			var oTable = this.byId("idPOTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items");
			var sPath, sOperator, sValue;
			if (mParams.filterItems) {
				mParams.filterItems.forEach(function(oItem) {
					var filter = oItem.getParent().getKey();
					if (filter === "LocalSubCat") {
						sPath = "LocalSubCat";
						sOperator = "EQ";
						sValue = oItem.getKey();
						oFilter = new Filter(sPath, sOperator, sValue);
						aFilter.push(oFilter);
					}
					if (filter === "Buyer") {
						sPath = "Buyer";
						sOperator = "EQ";
						sValue = oItem.getKey();
						oFilter = new Filter(sPath, sOperator, sValue);
						aFilter.push(oFilter);
					}
					if (filter === "DocType") {
						sPath = "DocType";
						sOperator = "EQ";
						sValue = oItem.getKey();
						oFilter = new Filter(sPath, sOperator, sValue);
						aFilter.push(oFilter);
					}
					if (filter === "Industry") {
						sPath = "Industry";
						sOperator = "EQ";
						sValue = oItem.getKey();
						oFilter = new Filter(sPath, sOperator, sValue);
						aFilter.push(oFilter);
					}
					if (filter === "PurchasingGroup") {
						sPath = "PurchasingGroup";
						sOperator = "EQ";
						sValue = oItem.getKey();
						oFilter = new Filter(sPath, sOperator, sValue);
						aFilter.push(oFilter);
					}
					if (filter === "RelStatus") {
						sPath = "RelStatus";
						sOperator = "EQ";
						sValue = oItem.getKey();
						oFilter = new Filter(sPath, sOperator, sValue);
						aFilter.push(oFilter);
					}
				});

				// apply filter settings
				// oBinding.filter(aFilter);
				// sap.ui.core.BusyIndicator.hide();
				if (aFilter.length > 0) {
					// Table Binding
					oDataModel.read("/PoHeadDetSet", {
						filters: aFilter,
						success: function(oData) {
							var jModel = new JSONModel(oData);
							that.getView().byId("idPOTable").setModel(jModel);
							that.byId("idSearchVendor").setValue("");
							sap.ui.core.BusyIndicator.hide();
						},
						error: function(oError) {
							sap.ui.core.BusyIndicator.hide();
							var emptyjModel = new JSONModel();
							that.getView().byId("idPOTable").setModel(emptyjModel);
							that.byId("idSearchVendor").setValue("");
							sap.ui.core.BusyIndicator.hide();
						}
					});
				} else {
					that.bindHeaderTable();
				}
			} else {
				that.bindHeaderTable();
			}
		},

		bindHeaderTable: function() {
			var that = this;
			// Current Date in yyyymmdd format
			var x = new Date();
			var y = x.getFullYear().toString();
			var m = (x.getMonth() + 1).toString();
			var d = x.getDate().toString();
			(d.length == 1) && (d = '0' + d);
			(m.length == 1) && (m = '0' + m);
			var yyyymmdd = y + m + d;
			// Set Filter Intital Values
			var dateValue = new Date();
			this.getOwnerComponent().getModel("AppConfig").setProperty("/fromDateValue", dateValue);
			this.getOwnerComponent().getModel("AppConfig").setProperty("/toDateValue", dateValue);
			// OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
			// oFilter
			// var oFilter1 = new sap.ui.model.Filter('CreatedOn', 'EQ', CreatedOn);
			var oFilter1 = new sap.ui.model.Filter("CreatedOn", FilterOperator.BT, yyyymmdd, yyyymmdd);
			var oFilter2 = new sap.ui.model.Filter('DocType', 'EQ', 'NB1');
			var oFilter3 = new sap.ui.model.Filter('DocType', 'EQ', 'ZNB1');
			oDataModel.read("/PoHeadDetSet", {
				filters: [oFilter1, oFilter2, oFilter3],
				success: function(oData) {
					var jModel = new JSONModel(oData);
					that.getView().byId("idPOTable").setModel(jModel);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oError) {
					// MessageBox.error("Header OData Loading Failed.");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		bindVendorFilter: function() {
			var that = this;
			// OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_EKGRP_F4_SRV");
			oDataModel.read("/vendorSet", {
				success: function(oData) {
					var jModel = new JSONModel(oData);
					that.getView().byId("idVendorFilterTable").setModel(jModel);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oError) {
					// MessageBox.error("Header OData Loading Failed.");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		// View Setting Dialog opener
		_openDialog: function(sName, sPage, fInit) {
			var oView = this.getView();
			// creates requested dialog if not yet created
			if (!this._mDialogs[sName]) {
				this._mDialogs[sName] = Fragment.load({
					id: oView.getId(),
					name: "zmmpoanalysis.zmmpoanalysis.view.dialog." + sName,
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					if (fInit) {
						fInit(oDialog);
					}
					return oDialog;
				});
			}
			this._mDialogs[sName].then(function(oDialog) {
				// opens the requested dialog
				oDialog.open(sPage);
			});
		},

		// Opens View Settings Dialog
		handleOpenDialog: function() {
			this._openDialog("Dialog");
			this.bindVendorFilter();
		},

		onLineitemClicked: function(oEvent) {
			var flag = true;
			var that = this;
			this.byId("masterPage").setBusy(true);
			sap.ui.core.BusyIndicator.show();
			var emptyjModel = new JSONModel();
			var item = oEvent.getSource().getBindingContext().getObject();
			if (item.PurchaseOrder) {
				that.getOwnerComponent().getModel("AppConfig").setProperty("/headerItem", item);
				that.getOwnerComponent().getModel("AppConfig").setProperty("/headerVisible", false);
				that.getOwnerComponent().getModel("AppConfig").setProperty("/searchWidth", "60%");
				that.getOwnerComponent().getModel("AppConfig").setProperty("/Supplier", "");
				if (flag) {
					this.byId("detailLayout").setSize("70%");
					this.getHeaderComment(item.PurchaseOrder);
					var oFilter1 = new sap.ui.model.Filter('PurchaseOrder', 'EQ', item.PurchaseOrder);
					// OData call
					var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
					oDataModel.read("/PoHeadDetSet('" + item.PurchaseOrder + "')/NavPoItem/", {
						success: function(oData) {
							var jModel = new JSONModel(oData);
							that.getView().byId("idIconTabBarMulti").setModel(jModel);
							//  for profitability and Gross Profit tab
							oDataModel.read("/PoReadProfitSet", {
								filters: [oFilter1],
								success: function(oData) {
									var jModel = new JSONModel(oData);
									that.getView().byId("idProfitability").setModel(jModel);
									that.getView().byId("idShrink").setModel(jModel);
									sap.ui.core.BusyIndicator.hide();
									that.byId("masterPage").setBusy(false);
									that.getOwnerComponent().getModel("AppConfig").setProperty("/profitData", oData);
								},
								error: function(oError) {
									// MessageBox.error("Header OData Loading Failed.");
									sap.ui.core.BusyIndicator.hide();
									this.byId("masterPage").setBusy(false);
									that.getView().byId("idProfitability").setModel(emptyjModel);
									that.getView().byId("idShrink").setModel(emptyjModel);
								}
							});
						},
						error: function(oError) {
							// MessageBox.error("Item OData Loading Failed.");
							sap.ui.core.BusyIndicator.hide();
							that.byId("masterPage").setBusy(false);
							that.getView().byId("idIconTabBarMulti").setModel(emptyjModel);
						}
					});
					//Release Strategy OData
					var oDataModel2 = this.getOwnerComponent().getModel("ZMM_READ_PO_REL_MATRIX_SRV");
					oDataModel2.read("/poRelMatrixSet", {
						filters: [oFilter1],
						success: function(oData) {
							var jModel = new JSONModel(oData);
							that.getView().byId("idRSTable").setModel(jModel);
							// sap.ui.core.BusyIndicator.hide();
						},
						error: function(oError) {
							// MessageBox.error("Header OData Loading Failed.");
							// sap.ui.core.BusyIndicator.hide();
							that.getView().byId("idRSTable").setModel(emptyjModel);
						}
					});
					//Header Comment OData
					oDataModel.read("/PoReadCommentSet", {
						filters: [oFilter1],
						success: function(oData) {
							var jModel = new JSONModel(oData);
							that.getView().byId("idCommentsTable").setModel(jModel);
							// sap.ui.core.BusyIndicator.hide();
						},
						error: function(oError) {
							// MessageBox.error("Header OData Loading Failed.");
							// sap.ui.core.BusyIndicator.hide();
							that.getView().byId("idCommentsTable").setModel(emptyjModel);
						}
					});
				} else {
					this.byId("detailLayout").setSize("0px");
				}
			}
		},

		getHeaderComment: function(PurchaseOrder) {
			var that = this;
			var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
			var oFilter1 = new sap.ui.model.Filter('PurchaseOrder', 'EQ', PurchaseOrder);
			//Header Comment OData
			oDataModel.read("/PoReadCommentSet", {
				filters: [oFilter1],
				success: function(oData) {
					var jModel = new JSONModel(oData);
					that.getView().byId("idCommentsTable").setModel(jModel);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oError) {
					// MessageBox.error("Header OData Loading Failed.");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onCloseDetailPress: function() {
			this.getOwnerComponent().getModel("AppConfig").setProperty("/headerVisible", true);
			this.getOwnerComponent().getModel("AppConfig").setProperty("/searchWidth", "30%");
			this.byId("detailLayout").setSize("0px");
		},
		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function(oEvent) {
			var bFullScreen = this.byId("detailLayout").getSize();
			if (bFullScreen !== "100%") {
				// store current layout and go full screen
				this.byId("detailLayout").setSize("100%");
				oEvent.getSource().setIcon("sap-icon://exit-full-screen");
			} else {
				this.byId("detailLayout").setSize("70%");
				oEvent.getSource().setIcon("sap-icon://full-screen");
			}
		},

		onExport: function() {
			var that = this;
			var aProducts, aData = [];
			var oHeader = {
				"PurchaseOrder": "Purchase Order",
				"LineItem": "Line Item",
				"Article": "Article",
				"Site": "Site",
				"ShortText": "Description",
				"OrdQty": "Order Quantity",
				"OrdUnit": "Order Unit",
				"QtyConversion": "Quanity Conversion",
				"Comment": "Comment",
				"UnitsSoldYtd": "Units Sold Ytd",
				"UnitsSoldLy": "Untis Sold Ly",
				"UnitsSoldL12m": "Units Sold L12m",
				"TotSlsYtd": "Total Sls Ytd",
				"TotSlsLy": "Total Sls Ly",
				"TotSlsL12m": "Total Sls L12m",
				"CogsYtd": "Cogs Ytd",
				"CogsLy": "Cogs Ly",
				"CogsL12M": "Cogs L12M",
				"GpAfVisYtd": "GP Ytd",
				"GpAfVisLy": "GP Ly",
				"GpAfVisL12m": "GP L12m",
				"SalesPrice": "Sales Price",
				"WholeSalePrice": "Whole Sale Price",
				"OrderReason": "Order Reason",
				"relOpenOrdQty": "Rel Open Ord Qty",
				"relOpenOrdVal": "Rel Open Order Value",
				"CdcQty": "Cdc Qty",
				"CdcCoverage": "Cdc Coverage",
				"EdcQty": "Edc Qty",
				"EdcCoverage": "Edc Coverage",
				"TotQtyStores": "Total Qty Stores",
				"StoresCoverage": "Stores Coverage",
				"TotQty": "Total Qty",
				"TotCoverage": "Total Coverage",
				"WeeklyDemand": "Weekly Demand",
				"DeletionIndicator": "Deletion Indicator",
				"DelvComplete": "Delv Complete",
				"notRelOpenOrdQty": "Not Rel Open Ord Qty",
				"notRelOpenOrdVal": "Not Rel Open Ord Val",
				"siteTier": "Site Tier",
				"globalTier": "Global Tier",
				"gpBeforeShirnkYTD": "GP Before Shirnk YTD",
				"gpAfterShirnkYTD": "GP After Shirnk YTD",
				"gpBeforeShirnkLY": " GP Before Shirnk LY",
				"gpAfterShirnkLY": "GP After Shirnk LY",
				"gpBeforeShirnk12M": "GP Before Shirnk 12M",
				"gpAfterShirnk12M": "GP After Shirnk 12M",
				"maP": "MAP",
				"sohSoDate": "SOH SO Date",
				"ooSoDate": "OO SO Date",
				"coSoDate": "CO SO Date",
				"poPrice": "PO Price",
				"CategoryDesc": "Category",
				"SiteDesc": "Site",
				"OnOrdCov": "On Order Coverage",
				"CurrentOrdCov": "Stock Cover on Receiving Current Order",
				"UnderRevCov": "Under Review PO Coverage",
				"covWoMtsSite": "Stock Cover on Receiving Current Order(without MTS)",
				"mts": "MTS/TS",
				"CurrentSiteSoh": "Current Site SOH"
			};
			aProducts = this.getView().byId("idIconTabBarMulti").getModel().getProperty('/results/');
			var aProfitData = this.getOwnerComponent().getModel("AppConfig").getProperty("/profitData").results;
			var wb = window.XLSX.utils.book_new();
			var headerItem = this.getOwnerComponent().getModel("AppConfig").getProperty("/headerItem");
			//Mapping of header items
			var orderedHeader = {
				"PurchaseOrder": headerItem.PurchaseOrder,
				"CreatedOn": that.formatter.getLocalTime(headerItem.CreatedOn),
				"CreatedBy": headerItem.CreatedBy,
				"Buyer": headerItem.Buyer,
				"BuyerName": headerItem.BuyerName,
				"Supplier": headerItem.Supplier,
				"SupplierName": headerItem.SupplierName,
				"PoValue": headerItem.PoValue,
				"VendorCurr": headerItem.VendorCurr,
				"IncoTerm": headerItem.IncoTerm,
				"IncoTermDesc": headerItem.IncoTermDesc,
				"Site": headerItem.Site,
				"DelvDate": headerItem.DelvDate,
				"Industry": headerItem.Industry,
				"DocType": headerItem.DocType,
				"RelStatus": headerItem.RelStatus,
				"LocalSubCat": headerItem.LocalSubCat,
				"Comment": headerItem.Comment,
				"FirstRelDate": that.formatter.getLocalTime(headerItem.FirstRelDate),
				"LastRelDate": that.formatter.getLocalTime(headerItem.LastRelDate),
				"review": headerItem.review,
				"reviewDate": that.formatter.getLocalTime(headerItem.reviewDate),
				"PoType": headerItem.PoType,
				"NavPoItem": headerItem.NavPoItem
			};
			var aHeader = [];
			delete headerItem.__metadata;
			var customHeader = {
				"PurchaseOrder": "Purchase Order",
				"CreatedOn": "Created On",
				"CreatedBy": "Created By",
				"Buyer": "Buyer",
				"BuyerName": "Buyer Name",
				"Supplier": "Supplier",
				"SupplierName": "Supplier Name",
				"PoValue": "PO Value",
				"VendorCurr": "Vendor Currency",
				"IncoTerm": "IncoTerms",
				"IncoTermDesc": "IncoTerm Description",
				"Site": "Receiving Site",
				"DelvDate": "Delivery Date",
				"Industry": "Industry",
				"DocType": "Document Type",
				"RelStatus": "Release Status",
				"LocalSubCat": "Local Sub Cat",
				"Comment": "Comment",
				"FirstRelDate": "First Release Date",
				"LastRelDate": "Last Release Date",
				"review": "Review",
				"reviewDate": "Review Date",
				"PoType": "PO Type",
				"NavPoItem": "NavPoItem"
			};
			aHeader.push(customHeader);
			aHeader.push(orderedHeader);
			var ws_header = window.XLSX.utils.json_to_sheet(aHeader, {
				skipHeader: true
			});
			var orderedDetails = [];
			aProducts.forEach(function(item) {
				var data = {
					"PurchaseOrder": item.PurchaseOrder,
					"LineItem": item.LineItem,
					"Article": item.Article,
					"Site": item.Site,
					"ShortText": item.ShortText,
					"OrdQty": item.OrdQty,
					"OrdUnit": item.OrdUnit,
					"QtyConversion": item.QtyConversion,
					"Comment": item.Comment,
					"UnitsSoldYtd": item.UnitsSoldYtd,
					"UnitsSoldLy": item.UnitsSoldLy,
					"UnitsSoldL12m": item.UnitsSoldL12m,
					"TotSlsYtd": item.TotSlsYtd,
					"TotSlsLy": item.TotSlsLy,
					"TotSlsL12m": item.TotSlsL12m,
					"CogsYtd": item.CogsYtd,
					"CogsLy": item.CogsLy,
					"CogsL12M": item.CogsL12M,
					"GpAfVisYtd": item.GpAfVisYtd,
					"GpAfVisLy": item.GpAfVisLy,
					"GpAfVisL12m": item.GpAfVisL12m,
					"SalesPrice": item.SalesPrice,
					"WholeSalePrice": item.WholeSalePrice,
					"OrderReason": item.OrderReason,
					"relOpenOrdQty": item.relOpenOrdQty,
					"relOpenOrdVal": item.relOpenOrdVal,
					"CdcQty": item.CdcQty,
					"CdcCoverage": item.CdcCoverage,
					"EdcQty": item.EdcQty,
					"EdcCoverage": item.EdcCoverage,
					"TotQtyStores": item.TotQtyStores,
					"StoresCoverage": item.StoresCoverage,
					"TotQty": item.TotQty,
					"TotCoverage": item.TotCoverage,
					"WeeklyDemand": item.WeeklyDemand,
					"DeletionIndicator": item.DeletionIndicator,
					"DelvComplete": item.DelvComplete,
					"notRelOpenOrdQty": item.notRelOpenOrdQty,
					"notRelOpenOrdVal": item.notRelOpenOrdVal,
					"siteTier": item.siteTier,
					"globalTier": item.globalTier,
					"gpBeforeShirnkYTD": item.gpBeforeShirnkYTD,
					"gpAfterShirnkYTD": item.gpAfterShirnkYTD,
					"gpBeforeShirnkLY": item.gpBeforeShirnkLY,
					"gpAfterShirnkLY": item.gpAfterShirnkLY,
					"gpBeforeShirnk12M": item.gpBeforeShirnk12M,
					"gpAfterShirnk12M": item.gpAfterShirnk12M,
					"maP": item.maP,
					"sohSoDate": that.formatter.getLocalTime(item.sohSoDate),
					"ooSoDate": that.formatter.getLocalTime(item.ooSoDate),
					"coSoDate": that.formatter.getLocalTime(item.coSoDate),
					"poPrice": item.poPrice,
					"CategoryDesc": item.CategoryDesc,
					"SiteDesc": item.SiteDesc,
					"OnOrdCov": item.OnOrdCov,
					"CurrentOrdCov": item.CurrentOrdCov,
					"UnderRevCov": item.UnderRevCov,
					"covWoMtsSite": item.covWoMtsSite,
					"mts": item.mts,
					"CurrentSiteSoh": item.CurrentSiteSoh
				};
				orderedDetails.push(data);
			});
			aData.push(oHeader);
			orderedDetails.forEach(function(data) {
				delete data.__metadata;
				aData.push(data);
			});
			// Custom Header for Profit Sheet
			var oProfitHeader = {
				"PurchaseOrder": "Purchase Order",
				"Article": "Article",
				"ShortText": "Description",
				"TotSlsYtd": "Total Sls Ytd",
				"TotSlsLy": "Total Sls Ly",
				"TotSlsL12m": "Total Sls L12m",
				"CogsYtd": "CogsYtd",
				"CogsLy": "Cogs Ly",
				"CogsL12M": "Cogs L12M",
				"GpAfVisYtd": "Gp After Vis Ytd",
				"GpAfVisLy": "Gp After Vis Ly",
				"GpAfVisL12m": "Gp After Vis L12m",
				"GpBfVisYtd": "Gp Before Vis Ytd",
				"GpBfVisLy": "Gp Before Vis Ly",
				"GpBfVisL12m": "Gp Before Vis L12m",
				"GpVisYtd": "Gp With Vis Ytd",
				"GpVisLy": "Gp With Vis Ly",
				"GpVisL12m": "Gp With Vis L12m",
				"gpBeforeShirnkYTD": "GP Before Shirnk YTD",
				"gpBeforeShirnkLY": "GP Before Shirnk LY",
				"gpBeforeShirnk12M": "GP Before Shirnk 12M",
				"gpAfterShirnkYTD": "GP After Shirnk YTD",
				"gpAfterShirnkLY": "GP After Shirnk LY",
				"gpAfterShirnk12M": "GP After Shirnk 12M",
				"UnitsSoldYtd": "Units Sold Ytd",
				"UnitsSoldLy": "Units Sold Ly",
				"UnitsSoldL12m": "Units Sold 12m"
			};
			var aProdfitItems = [];
			aProdfitItems.push(oProfitHeader);
			aProfitData.forEach(function(data) {
				delete data.__metadata;
				aProdfitItems.push(data);
			});

			// Adding Header Sheet
			window.XLSX.utils.book_append_sheet(wb, ws_header, "PO Header");
			// Adding Details Sheet
			var ws_details = window.XLSX.utils.json_to_sheet(aData, {
				skipHeader: true
			});
			window.XLSX.utils.book_append_sheet(wb, ws_details, "PO Details");
			// Adding Profitability Sheet
			var ws_Profit = window.XLSX.utils.json_to_sheet(aProdfitItems, {
				skipHeader: true
			});
			window.XLSX.utils.book_append_sheet(wb, ws_Profit, "Profitability & GP Shrink");
			// Adding GP Shrink
			window.XLSX.writeFile(wb, 'PO wise Details.xlsx');
		},

		onViewReleasedPO: function(oEvent) {
			var that = this;
			sap.ui.core.BusyIndicator.show();
			// Open Dialog Box
			this.getOwnerComponent().getModel("AppConfig").setProperty("/OrderType", "On Order PO List");
			this._openDialog("OpenOrder");
			// OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_OPEN_PO_SRV");
			var article = oEvent.getSource().getBindingContext().getObject().Article;
			var Site = oEvent.getSource().getBindingContext().getObject().Site;
			var PurchaseOrder = oEvent.getSource().getBindingContext().getObject().PurchaseOrder;
			// oFilter
			var oFilter1 = new sap.ui.model.Filter('Article', 'EQ', article);
			var oFilter2 = new sap.ui.model.Filter('RelPo', 'EQ', 'X');
			var oFilter3 = new sap.ui.model.Filter('Site', 'EQ', Site);
			var oFilter4 = new sap.ui.model.Filter('PurchaseOrder', 'EQ', PurchaseOrder);
			oDataModel.read("/OpenPoSet", {
				filters: [oFilter1, oFilter2, oFilter3, oFilter4],
				success: function(oData) {
					var jModel = new JSONModel(oData);
					that.getView().byId("idOpenOrderDialog").setModel(jModel);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oError) {
					// MessageBox.error("Header OData Loading Failed.");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onViewNotReleasedPO: function(oEvent) {
			var that = this;
			sap.ui.core.BusyIndicator.show();
			this.getOwnerComponent().getModel("AppConfig").setProperty("/OrderType", "Under Review PO List");
			this._openDialog("OpenOrder");
			// OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_OPEN_PO_SRV");
			var article = oEvent.getSource().getBindingContext().getObject().Article;
			var Site = oEvent.getSource().getBindingContext().getObject().Site;
			// oFilter
			var oFilter1 = new sap.ui.model.Filter('Article', 'EQ', article);
			var oFilter2 = new sap.ui.model.Filter('NotRelPo', 'EQ', 'X');
			var oFilter3 = new sap.ui.model.Filter('Site', 'EQ', Site);
			oDataModel.read("/OpenPoSet", {
				filters: [oFilter1, oFilter2, oFilter3],
				success: function(oData) {
					var jModel = new JSONModel(oData);
					that.getView().byId("idOpenOrderDialog").setModel(jModel);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oError) {
					// MessageBox.error("Header OData Loading Failed.");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onPreviewCancel: function(oEvent) {
			this._mDialogs.OpenOrder.then(function(oDialog) {
				oDialog.close();
			}.bind(this));
		},

		onUpdateHeaderComment: function(oEvent) {
			var that = this;
			var item = this.getOwnerComponent().getModel("AppConfig").getProperty("/headerItem");
			// OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
			var oEntity = {};
			oEntity.PurchaseOrder = item.PurchaseOrder;
			oEntity.Comment = item.Comment;
			oDataModel.create("/PoHeadCommentSet", oEntity, {
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					that.getHeaderComment(item.PurchaseOrder);
					MessageBox.success("Header Comment Posted Successfully.");
				},
				error: function(oError) {
					// MessageBox.error("Header OData Loading Failed.");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onReviewPO: function(oEvent) {
			var item = this.getOwnerComponent().getModel("AppConfig").getProperty("/headerItem");
			// OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
			var oEntity = {};
			oEntity.PurchaseOrder = item.PurchaseOrder;
			oEntity.review = "";
			oDataModel.create("/PoReviewSet", oEntity, {
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.success("PO Review Posted Successfully.");
				},
				error: function(oError) {
					var error = JSON.parse(oError.responseText);
					var message = error.error.message.value;
					MessageBox.error(message);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onReleasePO: function(oEvent) {
			var that = this;
			var item = this.getOwnerComponent().getModel("AppConfig").getProperty("/headerItem");
			// OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
			var oEntity = {};
			oEntity.PurchaseOrder = item.PurchaseOrder;
			oEntity.RelCode = this.byId("idReleaseCode").getSelectedKey();
			oEntity.Comment = this.byId("idReleaseComment").getValue();
			oDataModel.create("/PoReleaseSet", oEntity, {
				success: function(oSuccess, info) {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.information("PO Release Posted Successfully.");
					that.byId("idReleaseComment").setValue("");
					that._mDialogs.ReleasePO.then(function(oDialog) {
						oDialog.close();
					}.bind(that));
					that.rebindReleaseStrategy();
				},
				error: function(oError) {
					var error = JSON.parse(oError.responseText);
					var message = error.error.message.value;
					MessageBox.error(message);
					sap.ui.core.BusyIndicator.hide();
					that.byId("idReleaseComment").setValue("");
					that._mDialogs.ReleasePO.then(function(oDialog) {
						oDialog.close();
					}.bind(that));
				}
			});
		},

		rebindReleaseStrategy: function(oEvent) {
			var that = this;
			//Release Strategy OData
			var item = this.getOwnerComponent().getModel("AppConfig").getProperty("/headerItem");
			var oFilter1 = new sap.ui.model.Filter('PurchaseOrder', 'EQ', item.PurchaseOrder);
			var oDataModel2 = this.getOwnerComponent().getModel("ZMM_READ_PO_REL_MATRIX_SRV");
			oDataModel2.read("/poRelMatrixSet", {
				filters: [oFilter1],
				success: function(oData) {
					var jModel = new JSONModel(oData);
					that.getView().byId("idRSTable").setModel(jModel);
					sap.ui.core.BusyIndicator.hide();
				},
				error: function(oError) {
					// MessageBox.error("Header OData Loading Failed.");
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		onCancelReleasePO: function(oEvent) {
			var that = this;
			var item = this.getOwnerComponent().getModel("AppConfig").getProperty("/headerItem");
			// OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
			var oEntity = {};
			oEntity.PurchaseOrder = item.PurchaseOrder;
			oEntity.RelCode = this.byId("idReleaseCode").getSelectedKey();
			oEntity.Comment = this.byId("idReleaseComment").getValue();
			oDataModel.create("/PoCancelReleaseSet", oEntity, {
				success: function(oSuccess, info) {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.success("PO Release Posted Successfully.");
					that.byId("idReleaseComment").setValue("");
					that._mDialogs.ReleasePO.then(function(oDialog) {
						oDialog.close();
					}.bind(that));
					that.rebindReleaseStrategy();
				},
				error: function(oError) {
					var error = JSON.parse(oError.responseText);
					var message = error.error.message.value;
					MessageBox.error(message);
					sap.ui.core.BusyIndicator.hide();
					that.byId("idReleaseComment").setValue("");
					that._mDialogs.ReleasePO.then(function(oDialog) {
						oDialog.close();
					}.bind(that));
				}
			});
		},

		onSaveItemComments: function(oEvent) {
			var that = this;
			sap.ui.core.BusyIndicator.show();
			this.commentStatus = [];
			var item = this.getView().byId("idIconTabBarMulti").getModel();
			var aItem = item.getData().results;
			this.entitySet = [];
			var entity = {};
			// get all messages
			aItem.forEach(function(data) {
				entity = {};
				entity.PurchaseOrder = data.PurchaseOrder;
				entity.LineItem = data.LineItem;
				entity.Comment = data.Comment;
				that.entitySet.push(entity);
			});
			this.onMultiUploadSubmit(oEvent, 0);
			//OData Binding
			// var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
			// entitySet.forEach(function(oEntity) {
			// 	oDataModel.create("/POItemCommentSet", oEntity, {
			// 		success: function(oData) {
			// 			sap.ui.core.BusyIndicator.hide();
			// 			// MessageBox.success("Header Comment Posted Successfully.");
			// 		},
			// 		error: function(oError) {
			// 			// MessageBox.error("Header OData Loading Failed.");
			// 			sap.ui.core.BusyIndicator.hide();
			// 		}
			// 	});
			// });
			// oDataModel.submitChanges({
			// 	success: function(data, response) {
			// 		MessageBox.success("Batch Comment Posted Successfully.");
			// 	},
			// 	error: function(e) {
			// 		MessageBox.error("Batch OData Loading Failed.");
			// 	}
			// });
		},

		onMultiUploadSubmit: function(oEvent, index) {
			var that = this;
			if (!index) {
				index = 0;
			}
			//OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_PO_ANALYSIS_SRV");
			if (that.entitySet.length > 0 && index < that.entitySet.length) {
				var oEntity = that.entitySet[index];
				oDataModel.create("/POItemCommentSet", oEntity, {
					success: function(oData) {
						that.commentStatus.push("Comment Updated for Line Item: " + oEntity.LineItem);
						that.onMultiUploadSubmit(oEvent, index + 1);
					},
					error: function(oError) {
						that.commentStatus.push("Comment Update Failed for Line Item: " + oEntity.LineItem);
						that.onMultiUploadSubmit(oEvent, index + 1);
					}
				});
			} else {
				sap.ui.core.BusyIndicator.hide();
				var withSpaces = that.commentStatus.join(', ');
				MessageBox.information("Comments for PO line Items are updated Successfully");
				var detailsModel = that.getView().byId("idIconTabBarMulti");
				detailsModel.getModel().refresh(true);
			}
		},

		onSearch: function(oEvent) {
			// add filter for search
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var aFilters = new Filter({
					filters: [
						new Filter("SupplierName", FilterOperator.Contains, sQuery),
						new Filter("PurchaseOrder", FilterOperator.Contains, sQuery),
						new Filter("Supplier", FilterOperator.Contains, sQuery)
					],
					and: false
				});
			}
			// update list binding
			var oList = this.byId("idPOTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilters, "Application");
		},

		onSearchVendor: function(oEvent) {
			var that = this;
			var oFilter;
			// add filter for search
			var sQuery = oEvent.getSource().getValue();
			if (isNaN(Number(sQuery))) {
				oFilter = new sap.ui.model.Filter("NAME1", "EQ", '*' + sQuery + '*');
			} else {
				oFilter = new sap.ui.model.Filter("LIFNR", "EQ", '*' + sQuery + '*');
			}
			var aFilter = [];
			aFilter.push(oFilter);
			// OData Binding
			var oDataModel = this.getOwnerComponent().getModel("ZMM_EKGRP_F4_SRV");
			// oFilter
			if (aFilter.length > 0) {
				oDataModel.read("/vendorSet", {
					filters: aFilter,
					success: function(oData) {
						var jModel = new JSONModel(oData);
						that.getView().byId("idVendorFilterTable").setModel(jModel);
						sap.ui.core.BusyIndicator.hide();
					},
					error: function(oError) {
						// MessageBox.error("Header OData Loading Failed.");
						sap.ui.core.BusyIndicator.hide();
					}
				});
			}
		},

		getTokens: function(oEvent) {
			var ocompCode = this.getView().byId("multiInput1");
			if (ocompCode) {
				ocompCode.addValidator(function(args) {
					var text = args.text;
					return new Token({
						key: text,
						text: "\"" + text + "\""
					});
				});
			}
		},

		onReleaseView: function(oEvent) {
			// Open Dialog Box
			this.getOwnerComponent().getModel("AppConfig").setProperty("/OrderType", "PO Release");
			this._openDialog("ReleasePO");
			if (this.byId("idReleaseComment")) {
				this.byId("idReleaseComment").setValue("");
			}
		},

		onCancelPO: function(oEvent) {
			// Open Dialog Box
			this.getOwnerComponent().getModel("AppConfig").setProperty("/OrderType", "Cancel PO Release");
			this._openDialog("ReleasePO");
			if (this.byId("idReleaseComment")) {
				this.byId("idReleaseComment").setValue("");
			}
		},

		onReviewCancel: function(oEvent) {
			this._mDialogs.ReleasePO.then(function(oDialog) {
				oDialog.close();
			}.bind(this));
		},

		onSelect: function(oEvent) {
			var selectedItem = this.byId("idVendorFilterTable").getSelectedItem();
			var LIFNR = selectedItem.getBindingContext().getProperty("LIFNR");
			this.getOwnerComponent().getModel("AppConfig").setProperty("/Supplier", LIFNR);
		}

	});
});