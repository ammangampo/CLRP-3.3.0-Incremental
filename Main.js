/*
Author: Estrera, Josepth
Date Created: 04-13-2023
Test Description: 
    Verify DAR Approver L1 and L2 screens
    Verify User can view the list of transactions pending for review and approval 
    using DAR Approver L1 and L2 Accounts
Updated By: Alwin
Updated Date: 05/26/23
*/

function Test(params) {

//	navigateToMainPage();
//	clrpLogin("DAR_Encoder");
	

	fullPath = getDataFromSpreadsheet('Location', 'PDF Download Details');
	 
	Tester.Message(fullPath);
	//fullPath = 'C:/Users/Public/CLRP/Reports/2024-06-06/CLRP _Regression_ATC_094/ETD Application Form-2024-06-06_12_20_11.pdf';
	var text = PDF2_GetFullText(fullPath);

	//var text = PDF2_GetFullText('%WORKDIR%/pdf.pdf');
	
	Tester.Message(text);
	
	// Extract the CLRP Reference Number
	var clrpReferenceNumber = extractCLRPReferenceNumberETD(text);
	
	// Log the result 
	if (clrpReferenceNumber) {
	    Tester.Message("CLRP Reference Number: " + clrpReferenceNumber);
	} else {
	    Tester.Message("CLRP Reference Number not found.");
	}
		
}

function extractCLRPReferenceNumberETD(text) {
    var pattern = /CLRP Reference Number:\s*(CLRP_eTD-\d+)/;
    var match = text.match(pattern);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

function extractCLRPReferenceNumberRAF(text) {
   // Adjust the regular expression pattern to match the new format
    var pattern = /No\.\:\s*(CLRP-\d+)/;
    var match = text.match(pattern);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

g_load_libraries = ["Web"];
