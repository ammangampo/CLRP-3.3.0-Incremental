/*
Author: Mangampo, Alwin
Date Created:  5/28/2024
Test Case Description: 
Validate if the DAR User is able to upload 300 XML files with 300 In Favor Ofs
Updated By:
Updated Date:
*/

function Test(params)
{
    
    name = getDataFromSpreadsheet('Name of Beneficiary', 'DAR Beneficiaries');
    address = getDataFromSpreadsheet('Address', 'DAR Beneficiaries');
    count = 10;
    //title_type,area,title
    
    navigateToMainPage();
    clrpLogin("DAR_Encoder");
	darEncoderCreateRequest();
	enterTransactionDAR();
	enterDARPresenter();
    enterTitleReferenceDAR();
    enterDARExecutedBy();
    
    
/** Input Beneficiaries **/    
    for (i = 1; i < count + 1; i++ ) {
    
        var xmlfile = "C:\\Users\\Public\\CLRP\\300 XML\\PSD-9090_BA_L" + i + "_" + i + ".xml";
        Tester.Message(xmlfile);
        SeS('Upload_eTD_Choose_File').DoSendKeys(xmlfile);
        Global.DoSleep(1000);
        
    //Upload Image
	SeS('Upload_Scanned_TD').DoClick(true);
	Global.DoSleep(5000);
	SeS('Upload_Scanned_TD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg");
		
	Global.DoWaitFor('Image_ChooseFile',60000);
	Global.DoSleep(4000);
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
	
	SeS('Name_of_the_Beneficiary').DoSetText(name + " " + i );
	SeS('Address').DoSetText(address + " " + i);
	Global.DoSleep(3000);
	SeS('Generic_Add').DoClick();
	SeS('Generic_Add').DoClick();
        
    //TD Preview Screenshot and download
	Global.DoSendKeys('^j');
	Global.DoSendKeys('^w');
	SeS('TD_PreviewWithParameter', {index: i }).DoClick();
	Global.DoSleep(3000);
	Tester.CaptureDesktopImage('Preview');
	moveFileWithPrefixAndIndex("Encoder_XML_File" + i + "_ETD_Preview_", 11)
	SeS('Technical_Description_Preview_Screen_Close').DoClick();
    }

    //Next
    SeS('Generic_Next').DoClick();
    
    enterDARDocument();
    getDARTransactionNumber();
    clrpLogoutAdmin();
	
	/*DAR Approvel L1*/
	navigateToMainPage();
	clrpLogin("DAR_Approver_L1");
	darApproverView();
	SeS('DAR_Encoder_Document').DoClick();
	reviewDARDocument();
	Global.DoSleep(3000);
	approveDARTransaction();
	clrpLogoutAdmin();
	
	
	/*DAR Approvel L2*/
	navigateToMainPage();
	clrpLogin("DAR_Approver_L2");
	darApproverView();
	SeS('DAR_Encoder_Document').DoClick();
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

g_load_libraries=["Web"]