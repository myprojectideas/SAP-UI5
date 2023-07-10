sap.ui.define([], function() {
	"use strict";

	return {

		/**
		 * Returns Date 
		 * @public
		 * @param {string} sValue the number string to be date formatted
		 * @returns {string} sValue in DD-MM-YYYY
		 */
		dateUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
			var timestamp = sValue.seconds * 1000;
			var todate = new Date(timestamp).getDate();
			var tomonth = new Date(timestamp).getMonth();
			var monthText = months[tomonth];
			var toyear = new Date(timestamp).getFullYear();
			var original_date = todate + ' ' + monthText + ' ' + toyear;
			return original_date;
		},

		/**
		 * Returns Timestamp 
		 * @public
		 * @param {string} sValue the number string to be timestamp formatted
		 * @returns {string} sValue in DD-MM-YYYY: HH:MM:SS
		 */
		timestampUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			var timestamp = new Date(sValue.seconds * 1000);
			return timestamp;
		},

		/**
		 * Returns Location Link 
		 * @public
		 * @param {object} sValue the location object
		 * @returns {link address} sValue for href
		 */
		getLocation: function(sValue) {
			if (!sValue) {
				return "";
			}
			var href = "https://www.google.com/maps/search/?api=1&query=" + sValue.lat + "," + sValue.long;
			return href;
		},

		/**
		 * Returns Formatted Text 
		 * @public
		 * @param {object} sValue the input Text
		 * @returns {link address} sValue in different colour
		 */
		readType: function(sValue, nStatus) {

			if (!sValue) {
				return "";
			}
			if (nStatus === 0) {
				var formattedText = "<strong>" + sValue + '</strong>';
				return formattedText;
			} else {
				return sValue;
			}
		},

		/**
		 * Returns Calculated Duration
		 * @public
		 * @param {object} sValue the input Text
		 * @returns {link address} sValue in different colour
		 */
		calculateDuration: function(startTime, EndTime) {

			if (!startTime || !EndTime) {
				return "";
			}
			if (startTime && EndTime) {
				var duration = parseInt(EndTime, 0) - parseInt(startTime, 0);
				return duration;
			} else {
				return "";
			}
		},

		getAppointmentDetails: function(name, gender, age) {
			return name + ' | ' + gender + ' | ' + age;
		},

		/**
		 * Returns Role 
		 * @public
		 * @param {object} sValue the input Text
		 * @returns {link address} sValue as Controller or Driver
		 */
		getRole: function(sValue) {

			if (!sValue) {
				return "";
			}
			if (sValue === "auth_dr") {
				return "Driver";
			} else if (sValue === "auth_cont") {
				return "Controller";
			} else {
				return sValue;
			}
		},

		/**
		 * Returns NA 
		 * @public
		 * @param {object} sValue the input Text
		 * @returns {link address} sValue or NA
		 */
		getNA: function(sValue) {

			if (!sValue) {
				return "NA";
			} else {
				return sValue;
			}
		},

		/**
		 * Returns Status of Promotion
		 * @public
		 * @param {object} sValue the Timestamp
		 * @returns {link address} Active or Inactive
		 */
		promoStatus: function(sValue) {
			if (!sValue) {
				return "";
			}
			var date = new Date(sValue.seconds * 1000);
			var currentDate = new Date();
			if (currentDate > date) {
				return "Inactive";
			} else {
				return "Active";
			}
		},

		getServStatus: function(sValue) {
			if (!sValue) {
				return "Initiated";
			}
			if (sValue === 0) {
				return "Initiated";
			} else if (sValue === 1) {
				return "Driver Assigned";
			} else if (sValue === 2) {
				return "Driver Cancelled";
			} else if (sValue === 3) {
				return "Driver Accepted";
			} else if (sValue === 4) {
				return "Driver Arrived";
			} else if (sValue === 5) {
				return "Completed";
			} else {
				return sValue;
			}
		},

		getServState: function(sValue) {
			if (!sValue) {
				return "None";
			}
			if (sValue === 0) {
				return "None";
			} else if (sValue === 1) {
				return "Warning";
			} else if (sValue === 2) {
				return "Error";
			} else if (sValue === 3) {
				return "Warning";
			} else if (sValue === 4) {
				return "Information";
			} else if (sValue === 5) {
				return "Success";
			} else {
				return "None";
			}
		},

		getInsState: function(sValue) {
			if (!sValue) {
				return "None";
			}
			if (sValue == 0) {
				return "None";
			} else if (sValue == 2) {
				return "Information";
			} else if (sValue == 3) {
				return "Success";
			} else if (sValue == 1) {
				return "Error";
			} else if (sValue == true) {
				return "Success";
			} else if (sValue == false) {
				return "Error";
			} else {
				return "None";
			}
		},

		getInsStatus: function(sValue) {
			if (sValue == 0) {
				return "Created & Upcoming";
			} else if (sValue == 1) {
				return "Doctor Accepted & Upcoming";
			} else if (sValue == 2) {
				return "Doctor Declined";
			} else if (sValue == 3) {
				return "Doctor Joined";
			} else if (sValue == 4) {
				return "Doctor Completed";
			} else if (sValue == true) {
				return "Active";
			} else if (sValue == false) {
				return "Inactive";
			} else {
				return sValue;
			}
		},

		getShortStatus: function(sValue) {
			if (sValue == 0) {
				return "Upcoming";
			} else if (sValue == 1) {
				return "Accepted";
			} else if (sValue == 2) {
				return "Declined";
			} else if (sValue == 3) {
				return "Joined";
			} else if (sValue == 4) {
				return "Completed";
			} else if (sValue == true) {
				return "Active";
			} else if (sValue == false) {
				return "Inactive";
			} else {
				return sValue;
			}
		},

		getMonthName: function(sValue) {
			if (!sValue) {
				return "NA";
			}
			if (sValue == 1) {
				return "January";
			} else if (sValue == 2) {
				return "February";
			} else if (sValue == 3) {
				return "March";
			} else if (sValue == 4) {
				return "April";
			} else if (sValue == 5) {
				return "May";
			} else if (sValue == 6) {
				return "June";
			} else if (sValue == 7) {
				return "July";
			} else if (sValue == 8) {
				return "August";
			} else if (sValue == 9) {
				return "September";
			} else if (sValue == 10) {
				return "October";
			} else if (sValue == 11) {
				return "November";
			} else if (sValue == 12) {
				return "December";
			} else {
				return sValue;
			}
		},

		getDocState: function(sValue) {
			if (sValue == true) {
				return "Success";
			} else if (sValue == false) {
				return "Error";
			} else {
				return "None";
			}
		},

		getReviewStatus: function(sValue) {
			if (sValue == 'X') {
				return "Review Completed";
			} else {
				return "Review Pending";
			}
		},

		getReportVisibility: function(sValue) {
			if (sValue && sValue.length > 0) {
				return true;
			} else {
				return false;
			}
		},

		getLocalTime: function(sValue) {
			if (sValue) {
				var dateString = sValue;
				var year = +dateString.substring(0, 4);
				var month = +dateString.substring(4, 6);
				var day = +dateString.substring(6, 8);
				var date = new Date(year, month - 1, day);
				var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
				var todate = date.getDate();
				var tomonth = date.getMonth();
				var monthText = months[tomonth];
				var toyear = date.getFullYear();
				if (month < 10 && month > 0) {
					month = '0' + month.toString();
				}
				if (todate < 10 && todate > 0) {
					todate = '0' + todate.toString();
				}
				var original_date = todate + '.' + month + '.' + toyear;
				if (original_date == '30.0.1899') {
					return '';
				} else {
					return original_date;
				}
			} else {
				return "";
			}
		},

		getTimeDiff: function(sValue1, sValue2) {
			if (sValue1 && sValue2) {
				var sValue = sValue2 - sValue1;
				sValue = sValue / 60000;
				sValue = parseInt(sValue, 0);
				return sValue;
			} else {
				return sValue;
			}
		},

		removeZero: function(sValue) {
			if (sValue) {
				sValue = sValue.replace(/^0+/, '');
				return sValue;
			} else {
				return '';
			}
		},

		removedecimalZero: function(sValue) {
			if (sValue) {
				sValue = parseInt(sValue);
				sValue = sValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				if (sValue == '0') {
					return '0';
				} else {
					return sValue;
				}

			} else {
				return '0';
			}
		},

		formatDecimal: function(sValue) {
			if (sValue) {
				if (sValue == '0.000') {
					return '';
				} else {
					sValue = parseFloat(sValue).toFixed(2);
					return sValue;
				}

			} else {
				return '';
			}
		},

		customIcon: function(sValue) {
			if (sValue === "S") {
				return 'sap-icon://locked';
			} else if (sValue === "L") {
				return 'sap-icon://delete';
			} else {
				return '';
			}
		},

		customIcon2: function(sValue) {
			if (sValue === "X") {
				return 'sap-icon://message-success';
			} else {
				return '';
			}
		},

		currency: function(sValue) {
			if (sValue) {
				// Create our number formatter.
				var formatter = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'SAR'
				});

				return (formatter.format(sValue)); /* $2,500.00 */
			} else {
				return '';
			}
		},

		formatNumber: function(sValue) {
			if (sValue) {
				return sValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			} else {
				return '';
			}
		},

		roundNum: function(sValue) {
			if (sValue) {
				sValue = parseFloat(sValue).toFixed(2);
				sValue = Math.round(sValue);
				sValue = sValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				return sValue;
			} else {
				return '';
			}
		},

		formatTime: function(given_seconds) {
			given_seconds = parseInt(given_seconds);
			var dateObj = new Date(given_seconds * 1000);
			var hours = dateObj.getUTCHours();
			var minutes = dateObj.getUTCMinutes();
			var seconds = dateObj.getSeconds();

			var timeString = hours.toString().padStart(2, '0') + ':' +
				minutes.toString().padStart(2, '0') + ':' +
				seconds.toString().padStart(2, '0');
			return timeString;
		},

		calculateMultiply: function(sValue1, sValue2) {
			if (sValue1 && sValue2) {
				var sValue1 = parseInt(sValue1);
				var sValue2 = parseInt(sValue2);
				return (sValue1 * sValue2);
			} else {
				return '';
			}
		}
	};

});