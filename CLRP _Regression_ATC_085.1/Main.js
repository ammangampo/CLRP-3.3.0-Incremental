/*
Author: Mangampo, Alwin
Date Created: 5/28/2024
Test Case Description: 
"a. Validate if DAR Users can Input 500 Alphanumeric Characters in the following text Fields: 

1. Location of Properties; 
2. Name of Beneficiary and;
3. Address Text Fields. 

b. Validate if DAR Users can Input 500 Alphanumeric Characters in the following Tags in an XML and Upload it in CLRP:

1. <Desc_Corners></Desc_Corners>;
2. <Notes></Notes>;
3. <Location></Location>

c. Validate if all of the entered 500 alphanumeric characters are displayed in the eTD preview

d. Validate if all of the entered 500 alphanumeric characters are displayed in Order of Parcelization(From CLRP and Personal Copy in Email)

e. Validate the contents of the CLRP QR code shall be updated to only contain the following information:

1 CLRP Reference Number (auto-generated);
2 Registry of Deeds (ROD) - Enumerated Value; and,
3 Plan Number

f. Validate if the DAR Users can upload XML files with the following special characters in the following tags:

1. <Desc_Corners></Desc_Corners>: Period (.), apostrophe ('), dash (-), number (#), at (@), percent (%), slash (/), spaces, open and close parenthesis (()), coma (,), and enye (ñ/Ñ)
2. <Notes></Notes>: Period (.), apostrophe ('), dash (-), number (#), at (@), percent (%), slash (/), spaces, open and close parenthesis (()), coma (,), and enye (ñ/Ñ)"
Updated By:
Updated Date:
*/


function Test(params)
{

	navigateToMainPage();
	clrpLogin("DAR_Encoder");
	darEncoderCreateRequest();
	enterTransactionDAR();
	enterDARPresenter();
	enterTitleReferenceAndValidateLocationCount();
	enterDARExecutedBy();
	enterTwoDARBeneficiaries();
	enterDARDocument();
	getDARTransactionNumber();
	clrpLogoutAdmin();
	
	/*DAR Approvel L1*/ 
	
	navigateToMainPage();
	clrpLogin("DAR_Approver_L1");
	darApproverView();
	SeS('Generic_Next').DoClick();
	SeS('Generic_Next').DoClick();
	SeS('Generic_Next').DoClick();
	enterDARExecutedBy();
	approver1ViewBeneficiaries();
	reviewDARDocument();
	Global.DoSleep(3000);
	approveDARTransaction();
	clrpLogoutAdmin();
	
	/*DAR Approvel L2*/
	navigateToMainPage();
	clrpLogin("DAR_Approver_L2");
	darApproverView();
	SeS('Generic_Next').DoClick();
	SeS('Generic_Next').DoClick();
	SeS('Generic_Next').DoClick();
	enterDARExecutedBy();
	approver2ViewBeneficiaries();
	reviewDARDocument();
	Global.DoSleep(3000);
	approveDARTransaction();
	clrpLogoutAdmin();
	
	/*DAR Encoder*/
	navigateToMainPage();
	clrpLogin("DAR_Encoder");
	SeS('Dashboard').DoClick();
	printDAREncoder();
	clrpLogoutAdmin();

}

function enterTitleReferenceAndValidateLocationCount() {

	title_type = getDataFromSpreadsheet('Title Type', 'DAR Title Reference');
    title = getDataFromSpreadsheet('Title Number', 'DAR Title Reference');
    ccloa = getDataFromSpreadsheet('CCLOA Number', 'DAR Title Reference');
    location = getDataFromSpreadsheet('Location of Property', 'DAR Title Reference');
    area = getDataFromSpreadsheet('Total Area', 'DAR Title Reference');

	Global._DoWaitFor('Title_Type',5000,650);
	SeS('Title_Type').DoClick();
	SeS('Title_Type').DoSetText(title_type);
	Global._DoWaitFor('Generic_List',5000,1000);
	SeS('Generic_List').DoClick();
	SeS('Title_Number').DoClick();
	SeS('Title_Number').DoSetText(title);
	SeS('CCLOA_No.').DoClick();
	SeS('CCLOA_No.').DoSetText(ccloa);
	SeS('Location_of_Property').DoClick();
	SeS('Location_of_Property').DoSetText(location);
	SeS('Total_Area').DoClick();
	SeS('Total_Area').DoSetText(area);
	Global.DoSleep(560);
	SeS('Location_of_Property')._DoClick();
	SeS('Generic_Add').DoClick();
	
	var text = Navigator.DOMFindByXPath("//table[@class='v-table-table']//td[6]/div").GetText();
	count = text.length;
	Tester.AssertEqual('Validate if length of location of porperty is 255', count, 255);
	Tester.CaptureDesktopImage('Location of Property max length: ' + count);
	
	//Next
	SeS('Generic_Next').DoClick();


}

function enterTwoDARBeneficiaries() {


	var etd_file = "PSD-9090_BA_L8_8";
    name = getDataFromSpreadsheet('Name of Beneficiary', 'DAR Beneficiaries');
    address = getDataFromSpreadsheet('Address', 'DAR Beneficiaries');

	SeS('Upload_eTD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\XML File\\" + etd_file + ".xml");
	Global.DoSleep(3000);
	validatePromptMessageLocationMaxLength();
	
	//Upload Image
	SeS('Upload_Scanned_TD').DoClick(true);
	Global.DoSleep(5000);
	SeS('Upload_Scanned_TD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg");
		
	Global.DoWaitFor('Image_ChooseFile',60000);
	Global.DoSleep(4000);
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
	
	SeS('Name_of_the_Beneficiary').DoSetText(name);
	SeS('Address').DoSetText(address);
	Global.DoSleep(3000);
	SeS('Generic_Add').DoClick();
	SeS('Generic_Add').DoClick();
	
	//TD Preview Screenshot and download
    SeS('TD_Preview').DoClick();
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Preview');
    moveFileWithPrefixAndIndex("Encoder_First_XML_File_ETD_Preview_", 11);
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
    
    
	var etd_file = "PSD-9090_BA_L9_9";
	
	SeS('Upload_eTD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\XML File\\" + etd_file + ".xml");
	Global.DoSleep(3000);
	

	//Upload Image
	SeS('Upload_Scanned_TD').DoClick(true);
	Global.DoSleep(5000);
	SeS('Upload_Scanned_TD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg");
		
	Global.DoWaitFor('Image_ChooseFile',60000);
	Global.DoSleep(4000);
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
	
	SeS('Name_of_the_Beneficiary').DoSetText(name);
	SeS('Address').DoSetText(address);
	Global.DoSleep(3000);
	SeS('Generic_Add').DoClick();
	SeS('Generic_Add').DoClick();
	
	///TD Preview Screenshot and download
	 Global.DoSendKeys('^j');
	 Global.DoSendKeys('^w');
    Navigator.DOMFindByXPath("(//span[text()= 'TD Preview']/../../..)[2]").DoClick();
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Preview');
   
   
    moveFileWithPrefixAndIndex("Encoder_Second_XML_File_ETD_Preview_", 11);
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
	
	//Next
	SeS('Generic_Next').DoClick();


}

function validatePromptMessageLocationMaxLength(){

	var alertMessage = Navigator.DOMFindByXPath("//div[@class='v-slot v-slot-c-app-message-dialog-text']//b").GetText();
	Tester.AssertEqual('Validate Alert Message when Location tag hit the maximum field length', alertMessage, 'The "Location" tag details in your uploaded XML file have hit the maximum field length. We' + "'re trimming it to 250 characters for you.");
	Tester.CaptureDesktopImage(alertMessage);
	Navigator.SeSFind("//span[text()='OK']").DoClick();

}

function approver1ViewBeneficiaries(){
	
	Navigator.DOMFindByXPath("(//td[@class='v-table-cell-content'])[8]").DoClick();
	//TD Preview Screenshot and download
	Global.DoSendKeys('^j');
	Global.DoSendKeys('^w');
    SeS('TD_Preview').DoClick();
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Preview');
    moveFileWithPrefixAndIndex("Approver1_First_XML_File_ETD_Preview_", 11);
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
    
    Navigator.DOMFindByXPath("(//td[@class='v-table-cell-content'])[16]").DoClick();
	///TD Preview Screenshot and download
	Global.DoSendKeys('^j');
	Global.DoSendKeys('^w');
    Navigator.DOMFindByXPath("(//span[text()= 'TD Preview']/../../..)[2]").DoClick();
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Preview');
    moveFileWithPrefixAndIndex("Approver1_Second_XML_File_ETD_Preview_", 11);
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
	
	//Next
	SeS('Generic_Next').DoClick();




}

function approver2ViewBeneficiaries(){


	Navigator.DOMFindByXPath("(//td[@class='v-table-cell-content'])[8]").DoClick();
	//TD Preview Screenshot and download
	Global.DoSendKeys('^j');
	Global.DoSendKeys('^w');
    SeS('TD_Preview').DoClick();
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Preview');
    moveFileWithPrefixAndIndex("Approver2_First_XML_File_ETD_Preview_", 11);
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
    
    Navigator.DOMFindByXPath("(//td[@class='v-table-cell-content'])[16]").DoClick();
	///TD Preview Screenshot and download
	Global.DoSendKeys('^j');
	Global.DoSendKeys('^w');
    Navigator.DOMFindByXPath("(//span[text()= 'TD Preview']/../../..)[2]").DoClick();
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Preview');
    moveFileWithPrefixAndIndex("Approver2_Second_XML_File_ETD_Preview_", 11);
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
	
	//Next
	SeS('Generic_Next').DoClick();




}

g_load_libraries=["Web"]

