sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		//app Congiguration model
		createAppConfigModel: function() {
			var appData = {
				"headerItem": {},
				"headerVisible": true,
				"searchWidth": "30%",
				"OrderType": "",
				"fromDateValue": "",
				"toDateValue": "",
				"checked": true,
				"vendorModel": "",
				"Supplier": "",
				"profitData": []
			};
			var oModel = new JSONModel(appData);
			return oModel;
		}

	};
});