/*
Author: Mangampo, Alwin
Date Created:  6/3/2024
Test Case Description: 
"Validate the following scenario for the eTD New Functionalities:

1. Validate if the following text field contents won't be deleted after clicking the [Clear] button:

a. TOTAL No. of Lots on Approved Plan
b. TOTAL No. of Encoded Lots
c. TOTAL No. of Lots Remaining

2. Validate prompt message upon clicking the [Clear] button:

""Are you sure you want to delete all encoded technical description?""

                                      Y/N
3. Validate the button functionalities in the prompt message:

No - Clicking No will retain all user input
Yes -  It will clear all text fields.

4. Validate prompt message upon uploading an XML with a different plan number:

""Invalid plan number format.""

5. Validate if the first row(Start Point 0) of the Adjoining directions, Lot No., Block No., and Plan No. in the Tie Point Coordinate (Local) are disabled."
Updated By:
Updated Date:
*/

function Test(params) {
 
     navigateToMainPage();
     clrpLogin("Individual_User");
     SeS('CLRP_Submit_ETD').DoClick();
     enterETDTiepoint();
     SeS('ETD_Submit_RegistryOfDeeds').DoClick();
     Global.DoSendKeys(rd_name);
     Global.DoSleep(1000);
     Global.DoSendKeys('{ENTER}');
     SeS('ETD_Submit_No.Parcels').DoSetText('2');
     validatePlanNumberFormat();
     SeS('ETD_Submit_PlanNumber').DoSetText('PSD-9090');
     uploadXMLFile();
     selectOptionEncodeETD();
     validateClearFunctionality();
     validateClearFunctionalityYes();
     validateClearFunctionalityNo();
     validateTiePointCoordinate();
     submitETD();
     clrpLogout();
	
}



function validatePlanNumberFormat() {
    // Set the plan number text field with an invalid format
    SeS('ETD_Submit_PlanNumber').DoSetText('PSD-9091');
    
    // Sleep to wait for any asynchronous processing
    Global.DoSleep(5000);
    
    // Click the upload button
    SeS('ETD_Submit_Upload_eTD_Upload').DoClick();
    
    // Function to handle file upload
    uploadXMLFile();
    
    // Validate the prompt message for invalid plan number format
    var planNoPrompt = Navigator.DOMFindByXPath("//div[@class='v-slot v-slot-c-app-message-dialog-text']//b").GetText();
    Tester.AssertEqual('Validate the prompt for invalid plan number.', "Invalid plan number format.", planNoPrompt);
    
    // Capture a screenshot of the prompt
    Tester.CaptureDesktopImage('Prompt displayed: ' + planNoPrompt);
    
    // Click OK on the prompt
    Navigator.SeSFind("//span[text()='OK']/../..").DoClick();
}

function validateClearFunctionality() {
    /*
    Validate if the following text field contents won't be deleted after clicking the [Clear] button:

    a. TOTAL No. of Lots on Approved Plan
    b. TOTAL No. of Encoded Lots
    c. TOTAL No. of Lots Remaining
    */
    
    // Click the Clear button
    Navigator.DOMFindByXPath("(//span[@class='v-button-wrap'])[10]").DoClick();
    
    // Validate the prompt message
    var clearPrompt = Navigator.SeSFind("//div[contains(text(),'Are you sure')]").GetText();
    Tester.AssertEqual('Validate prompt when "Clear" button is clicked.', "Are you sure you want to delete all encoded technical description?", clearPrompt);
    Tester.CaptureDesktopImage('Prompt displayed: ' + clearPrompt);
    
    // Click Yes on the prompt
    Navigator.SeSFind("//span[text()='Yes']/..").DoClick();

    // Validate that the field values are not deleted
    var totalApprovedPlan = Navigator.DOMFindByXPath("//div[text()='TOTAL No. of Lots on Approved Plan:']/../following-sibling::div//input").GetValue();
    Tester.AssertNotNull('Validate that "TOTAL No. of Lots on Approved Plan" field value is not null or not deleted', totalApprovedPlan);
    
    var totalEncodedLots = Navigator.DOMFindByXPath("//div[text()='TOTAL No. of Encoded Lots:']/../following-sibling::div//input").GetValue();
    Tester.AssertNotNull('Validate that "TOTAL No. of Encoded Lots" field value is not null or not deleted', totalEncodedLots);
    
    var totalLotsRemaining = Navigator.DOMFindByXPath("//div[text()='TOTAL No. of Lots Remaining:']/../following-sibling::div//input").GetValue();
    Tester.AssertNotNull('Validate that "TOTAL No. of Lots Remaining" field value is not null or not deleted', totalLotsRemaining);
    
    // Capture screenshot for verification
    Tester.CaptureDesktopImage('Fields content not deleted after clicking Clear button');
}

function validateClearFunctionalityYes() {
   
   	// Enter initial plan information and encode ETD with unique Block and Lot
    enterPlanInformationEncodeETDUniqueBlockAndLot();
    Tester.CaptureDesktopImage('Encoded Plan Information');

    // Simulate clicking the Clear button
    Navigator.DOMFindByXPath("(//span[@class='v-button-wrap'])[10]").DoClick();

    // Validate the prompt message
    var clearPrompt = Navigator.SeSFind("//div[contains(text(),'Are you sure')]").GetText();
    Tester.AssertEqual('Validate prompt when "Clear" button is clicked.', "Are you sure you want to delete all encoded technical description?", clearPrompt);
    Tester.CaptureDesktopImage('Prompt displayed: ' + clearPrompt);

    // Click Yes on the prompt
    Navigator.SeSFind("//span[text()='Yes']/..").DoClick();

    // List of fields that should not be cleared
    var fieldsToRetain = [
        { field: 'ETD_Tie_Point_ID', description: 'Tie Point ID' },
        { field: 'ETD_Plan_No', description: 'Plan No' },
        { field: 'ETD_Description_Tie_Point_ID', description: 'Description Tie Point ID' },
        { field: 'ETD_Total_Lots_Approved_Plan', description: 'TOTAL No. of Lots on Approved Plan' },
        { field: 'ETD_Total_Encoded_Lots', description: 'TOTAL No. of Encoded Lots' },
        { field: 'ETD_Total_Lots_Remaining', description: 'TOTAL No. of Lots Remaining' },
        { field: 'ETD_Tie_Point', description: 'Tie Point' }
    ];

    // Validate that fields to retain are not cleared
    	var fieldsToRetainCount = fieldsToRetain.length;
	    for(i = 0; i < fieldsToRetainCount; i ++) {
	    	var checkIfNotNull = SeS(fieldsToRetain[i].field).GetValue();
			Tester.AssertNotNull('Validate that '+ fieldsToRetain[i].description + ' field value is not null or not deleted', checkIfNotNull);
			Tester.CaptureDesktopImage(fieldsToRetain[i].description + ' is not deleted.')
	    }
    
    // List of fields that should be cleared 
    var fieldsToClear = [
    	{ field: 'ETD_Block_No', description: 'Block No' },
        { field: 'ETD_Lot_No', description: 'Lot No' },
        { field: 'ETD_Portion_of', description: 'Portion of' },
        { field: 'ETD_Location', description: 'Location' },
        { field: 'ETD_Area', description: 'Area' },
        { field: 'ETD_Unit_of_Measure', description: 'Unit of Measure' },
        { field: 'ETD_Description_of_Corners', description: 'Description of Corners' },
        { field: 'ETD_Survey_System', description: 'Survey System' },
        { field: 'ETD_Bearing', description: 'Bearing' },
        { field: 'ETD_LRC/Records_No', description: 'LRC/Records No' },
        { field: 'ETD_Declination', description: 'Declination' },
        { field: 'ETD_DateOf_Orginal_Survey', description: 'Date of Original Survey' },
        { field: 'ETD_DateOf_Survey_Executed', description: 'Date of Survey Executed' },
        { field: 'ETD_DateOf_Survey_Approved', description: 'Date of Survey Approved' },
        { field: 'ETD_Geodetic_Engineer', description: 'Geodetic Engineer' },
        { field: 'ETD_Notes', description: 'Notes' }
    ];

    // Validate that fields to clear are indeed cleared
    	var fieldsToClearCount = fieldsToClear.length;
	    for(i = 0; i < fieldsToClearCount; i ++) {
	    	var checkIfNull = SeS(fieldsToClear[i].field).GetValue();
			Tester.AssertEqual('Validate that '+ fieldsToClear[i].description + ' field value is null or deleted', checkIfNull, '');
			Tester.CaptureDesktopImage(fieldsToClear[i].description + ' is deleted.')
	    }

    // Capture screenshot for verification
    Tester.CaptureDesktopImage('Field content validation after clicking Yes button');
}

function validateClearFunctionalityNo() {
    enterPlanInformationEncodeETDUniqueBlockAndLot();
    Tester.CaptureDesktopImage('Encoded Plan Information');

    // Simulate clicking the Clear button
    Navigator.DOMFindByXPath("(//span[@class='v-button-wrap'])[10]").DoClick();

    // Validate the prompt message
    var clearPrompt = Navigator.SeSFind("//div[contains(text(),'Are you sure')]").GetText();
    Tester.AssertEqual('Validate prompt when "Clear" button is clicked.', "Are you sure you want to delete all encoded technical description?", clearPrompt);
    Tester.CaptureDesktopImage('Prompt displayed: ' + clearPrompt);

    // Click No on the prompt
    Navigator.SeSFind("//span[text()='No']/..").DoClick();

    // Validate that all user inputs are retained

    // List of fields that should retain user input
    var fieldsToRetain = [
        { field: 'ETD_Tie_Point_ID', description: 'Tie Point ID' },
        { field: 'ETD_Plan_No', description: 'Plan No' },
        { field: 'ETD_Description_Tie_Point_ID', description: 'Description Tie Point ID' },
        { field: 'ETD_Total_Lots_Approved_Plan', description: 'TOTAL No. of Lots on Approved Plan' },
        { field: 'ETD_Total_Encoded_Lots', description: 'TOTAL No. of Encoded Lots' },
        { field: 'ETD_Total_Lots_Remaining', description: 'TOTAL No. of Lots Remaining' },
        { field: 'ETD_Tie_Point', description: 'Tie Point' },
        { field: 'ETD_Block_No', description: 'Block No' },
        { field: 'ETD_Lot_No', description: 'Lot No' },
        { field: 'ETD_Portion_of', description: 'Portion of' },
        { field: 'ETD_Location', description: 'Location' },
        { field: 'ETD_Area', description: 'Area' },
        { field: 'ETD_Unit_of_Measure', description: 'Unit of Measure' },
        { field: 'ETD_Description_of_Corners', description: 'Description of Corners' },
        { field: 'ETD_Survey_System', description: 'Survey System' },
        { field: 'ETD_Bearing', description: 'Bearing' },
        { field: 'ETD_LRC/Records_No', description: 'LRC/Records No' },
        { field: 'ETD_Declination', description: 'Declination' },
        { field: 'ETD_DateOf_Orginal_Survey', description: 'Date of Original Survey' },
        { field: 'ETD_DateOf_Survey_Executed', description: 'Date of Survey Executed' },
        { field: 'ETD_DateOf_Survey_Approved', description: 'Date of Survey Approved' },
        { field: 'ETD_Geodetic_Engineer', description: 'Geodetic Engineer' },
        { field: 'ETD_Notes', description: 'Notes' }
    ];

    // Validate that all user inputs in fieldsToRetain are retained
    	var fieldsToRetainCount = fieldsToRetain.length;
	    for(i = 0; i < fieldsToRetainCount; i ++) {
	    	var checkIfNotNull = SeS(fieldsToRetain[i].field).GetValue();
			Tester.AssertNotNull('Validate that '+ fieldsToRetain[i].description + ' field value is not null or not deleted', checkIfNotNull);
			Tester.CaptureDesktopImage(fieldsToRetain[i].description + ' is not deleted.')
	    }

    // Capture screenshot for verification
    Tester.CaptureDesktopImage('Field content validation after clicking No button');
}

function validateTiePointCoordinate() {
	
	SeS('ETD_Add_Corners').DoSetText('4');
	SeS('ETD_Add').DoClick();
	
	for (var i = 1; i < 4; i ++){
	var index = 12 + i ;
	Tester.Message(index);
	
	var isdisabled = Navigator.DOMFindByXPath("(//table[@class='v-table-table']//td["+ index +"]//input)[1]").DoDOMGetAttribute('class');
	Tester.AssertContains('Check field if disabled', isdisabled, 'readonly');
	Tester.CaptureDesktopImage('Disabled');
	
	}
	
	SeS('ETD_NorthSouth_0').DoSetText('6');
	SeS('ETD_Distance_0').DoSetText('100');
	SeS('ETD_NorthSouth_1').DoSetText('6');
	SeS('ETD_Distance_1').DoSetText('10');
	SeS('ETD_NorthSouth_2').DoSetText('2');
	SeS('ETD_Distance_2').DoSetText('10');
	SeS('ETD_NorthSouth_3').DoSetText('4');
	SeS('ETD_Distance_3').DoSetText('10');
	SeS('ETD_NorthSouth_4').DoSetText('8');
	SeS('ETD_Distance_4').DoSetText('10');
	SeS('ETD_Save').DoClick();


}


g_load_libraries=["Web"]
