//RPS CLRP Functions.js
var username, password;
var rd_name = 'Province of Lanao del Sur';
var email = 'clrpauto@gmail.com';
var MobileNo = '09705972833';
Global.place;
Global.tiePointDesc;
Global.descTiePointID;
Global.tiePointID;
Global.destinationFile;

var url = "https://uat.clrp.com.ph/";
//var url = "https://staging.clrp.com.ph/app/";
var mainUrl = 'https://uat.clrp.com.ph/app/#main';

function navigateToMainPage() {
    //Created By: Josepth 04-01-23
    WebDriver.Close();
    Global.DoSetScreenResolution(1920, 1080);
    WebDriver.CreateDriver(null);
    WebDriver.SetUrl(mainUrl);
    Navigator.Maximize();

}

function navigateToHomePage() {
    SeS('Home').DoClick();
}

function navigateCLRPPage() {

    WebDriver.Close();
    Global.DoSetScreenResolution(1920, 1080);
    WebDriver.CreateDriver(null);
    WebDriver.SetUrl(url);
    Navigator.Maximize();
}

function getCredentials(user_type) {
    //Open the spreadsheet
    if (url.indexOf("uat") !== -1) {
        var success = Spreadsheet.DoAttach('%WORKDIR%/Data.xlsx', 'CLRP Credentials UAT');
    } else if (url.indexOf("staging") !== -1) {
        var success = Spreadsheet.DoAttach('%WORKDIR%/Data.xlsx', 'CLRP Credentials Staging');
    }
    Tester.Assert('Open Spreadsheet', success);


    while (Spreadsheet.DoSequential()) {
        if (Spreadsheet.GetCell(0) == user_type) {
            username = Spreadsheet.GetCell(1);
            password = Spreadsheet.GetCell(2);
            Tester.Message(username);
            Tester.Message(password);
        }
    }

}

function getTiePoint(index) {
    //Open the spreadsheet
    var success = Spreadsheet.DoAttach('%WORKDIR%/Validated_Tie_Point (1).xlsx', 'Tie Point List');
    Tester.Assert('Open Spreadsheet', success);

    while (Spreadsheet.DoSequential()) {
        if (Spreadsheet.GetCell(0) == index) {
            place = Spreadsheet.GetCell(4);
            tiePointDesc = Spreadsheet.GetCell(3);
            descTiePointID = Spreadsheet.GetCell(2);
            tiePointID = Spreadsheet.GetCell(1);
            Tester.Message(place);
            Tester.Message(tiePointDesc);
            Tester.Message(descTiePointID);
            Tester.Message(tiePointID);

        }
    }

}

function getDataFromSpreadsheet(columnName, tabName) {
    //Open the spreadsheet
    var TCID = Tester.GetTestName();
    var success = Spreadsheet.DoAttach('%WORKDIR%/Data.xlsx', tabName);
    Tester.Assert('Open Spreadsheet', success);

    var value = '';
    while (Spreadsheet.DoSequential()) {
        if (Spreadsheet.GetCell(0) == TCID) {
            value = Spreadsheet.GetCell(Spreadsheet.GetColumnIndexByName(columnName));
        }
    }
    Tester.Message('The Value is : ' + value);
    return value;
}


function enterTransactionDAR() { //For DAR Encoder User
    //Alwin - 05/22

    minor_transaction = getDataFromSpreadsheet('Minor Transaction', 'DAR Transaction');
    surv_plan = getDataFromSpreadsheet('Survey Plan Number', 'DAR Transaction');
    number_of_titles = getDataFromSpreadsheet('Number of Titles', 'DAR Transaction');

    SeS('Registry_Of_Deeds_Textbox').DoSendKeys(rd_name);
    SeS('Generic_List').DoClick();
    Global.DoSendKeys('{ENTER}')
    SeS('RoD_Minor_Transaction_Textbox').DoSetText(minor_transaction);
    SeS('Generic_List').DoClick();
    SeS('RoD_Survey_Plan_Number').DoSetText(surv_plan);
    SeS('RoD_Number_Of_Titles').DoSetText(number_of_titles);
    SeS('RoD_Select_Tie_Point').DoClick();
    SeS('STP_Place_Textbox').DoSetText('QUEZON CITY');
    Global.DoSendKeys('{ENTER}');
    SeS('ST_ID_Description_Select').DoClick();
    SeS('STP_Finish_Selection').DoClick();
    SeS('Generic_Next').DoClick();
}

function enterTitleReferenceDAR(title_type, area, title) {

    title_type = getDataFromSpreadsheet('Title Type', 'DAR Title Reference');
    title = getDataFromSpreadsheet('Title Number', 'DAR Title Reference');
    ccloa = getDataFromSpreadsheet('CCLOA Number', 'DAR Title Reference');
    location = getDataFromSpreadsheet('Location of Property', 'DAR Title Reference');
    area = getDataFromSpreadsheet('Total Area', 'DAR Title Reference');

    Global._DoWaitFor('Title_Type', 5000, 650);
    SeS('Title_Type').DoSetText(title_type);
    Global._DoWaitFor('Generic_List', 5000, 1000);
    SeS('Generic_List').DoClick();
    SeS('Title_Number').DoSetText(title);
    SeS('CCLOA_No.').DoSetText(ccloa);
    SeS('Location_of_Property').DoSetText(location);
    SeS('Total_Area').DoSetText(area);
    Global.DoSleep(560);
    SeS('Location_of_Property')._DoClick();
    SeS('Generic_Add').DoClick();
    //Next
    SeS('Generic_Next').DoClick();
}

function enterBeneficiariesDAR() {

    etd_file = getDataFromSpreadsheet('ETD File', 'DAR Beneficiaries');
    scanned_td = getDataFromSpreadsheet('Scanned TD', 'DAR Beneficiaries');
    name = getDataFromSpreadsheet('Name of Beneficiary', 'DAR Beneficiaries');
    address = getDataFromSpreadsheet('Address', 'DAR Beneficiaries');

    SeS('Upload_eTD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\XML File\\" + etd_file + ".xml");
    Global.DoSleep(10000);
    Global.DoSendKeys('{f5}');

    //Upload Image
    SeS('Upload_Scanned_TD').DoClick(true);
    Global.DoSleep(5000);
    SeS('Upload_Scanned_TD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg");

    Global.DoWaitFor('Image_ChooseFile', 60000);
    Global.DoSleep(4000);
    SeS('Technical_Description_Preview_Screen_Close').DoClick();

    SeS('Name_of_the_Beneficiary').DoSetText(name);
    SeS('Address').DoSetText(address);
    Global.DoSleep(3000);
    SeS('Generic_Add').DoClick();
    SeS('Generic_Add').DoClick();

    //TD Preview
    SeS('TD_Preview').DoClick();
    SeS('Technical_Description_Preview_Screen_Close').DoClick();

    // Screenshot and download
    SeS('TD_Preview').DoClick();
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Preview');
    moveFileWithPrefixAndIndex("ETD Preview-", 11);


    //Next
    SeS('Generic_Next').DoClick();
}

function moveFileWithPrefixAndIndex(prefix, index) {
    // Created by: Alwin - 05/23/24

    for (var i = 0; i < index; i++) {
        Global.DoSendKeys('{TAB}');
    }
    Global.DoSendKeys('{ENTER}');

    // Get the current date and time
    var dt = new Date();
    var year = dt.getFullYear();
    var month = (dt.getMonth() + 1 < 10 ? '0' : '') + (dt.getMonth() + 1);
    var day = (dt.getDate() < 10 ? '0' : '') + dt.getDate();
    var hours = (dt.getHours() < 10 ? '0' : '') + dt.getHours();
    var minutes = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
    var seconds = (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds();

    var formattedDateTime = year + '-' + month + '-' + day + '_' + hours + '_' + minutes + '_' + seconds;
    Global.DoSleep(3000);

    // Specify the file name with the given prefix
    var fileName = prefix + "-" + formattedDateTime + ".pdf";
    Global.DoSendKeys(fileName);
    Global.DoSendKeys('{ENTER}');

    var TCID = getDataFromSpreadsheet('TCID', 'DAR Transaction');
    Tester.Message(TCID);

    // Define source and destination
    var shell = new ActiveXObject("WScript.Shell");
    var userProfile = shell.ExpandEnvironmentStrings("%USERPROFILE%");
    var sourceFolder = userProfile + "\\Downloads\\";
    var dateToday = year + '-' + month + '-' + day;
    var sourceFile = fileName;
    var destinationFolder = "C:\\Users\\Public\\CLRP\\Reports\\" + dateToday + "\\" + TCID + "\\";
    var destinationFile = destinationFolder + "\\" + fileName;

    var fso = new ActiveXObject("Scripting.FileSystemObject");

    // Specify the path for the batch file
    var batchFileName = "moveFiles.bat";
    var batchFilePath = "C:\\Users\\Public\\CLRP\\" + batchFileName;

    // Open the batch file for writing
    var textfile = fso.OpenTextFile(batchFilePath, 2, true);

    // Write the commands to the batch file
    textfile.WriteLine("@echo off");
    textfile.WriteLine("if not exist \"" + destinationFolder + "\" mkdir \"" + destinationFolder + "\"");
    textfile.WriteLine("set \"source=" + sourceFolder + sourceFile + "\"");
    textfile.WriteLine("set \"destination=" + destinationFile + "\"");
    textfile.WriteLine("copy \"%source%\" \"%destination%\"");

    // Close the batch file
    textfile.Close();

    // Launch the batch file
    Global.DoLaunch(batchFilePath);

    // Log the destination folder and file name for verification
    Tester.Message("Folder created and file copied to: " + destinationFile);
}


function clrpCredentials(userType) {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var fileusers = fso.OpenTextFile("C:\\Users\\Public\\CLRP\\CLRPCredentials.txt");
    var reg = new RegExp("^" + userType + "$", 'i');
    while (!fileusers.AtEndOfStream) {
        var users = fileusers.ReadLine();
        if (reg.test(users)) {
            username = fileusers.ReadLine();
            password = fileusers.ReadLine();
            break;
        }
    }

    fileusers.Close();
}

function clrpLogin(userType) {
    //Updated By: Josepth 4.11
    //Created By: Josepth 4.01
    getCredentials(userType);
    SeS('CLRP_Main_Login').DoClick();
    SeS('Login_Username').DoSetText(username);
    SeS('Login_Password').DoSetText(password);
    SeS('Login_Button').DoClick();
    //	Global._DoWaitFor('Label_View_Transactions',2000,0);
    //	Global._DoWaitFor('Dashboard',2000,0);

    //Validation
    //		if(Navigator.CheckObjectExists("Label_View_Transactions") || Navigator.CheckObjectExists('Dashboard')){
    //			Global.DoSleep(500);
    //			Tester.Assert('Successfully Login',true);
    //			Tester.CaptureDesktopImage('CLRP Login');
    //		}else{ 
    //			Tester.CaptureDesktopImage('CLRP Login');
    //			Tester.FailTest('Failed to Login CLRP'); }

    if (Global.DoWaitFor('Alert_Later', 5000, 1000)) {
        SeS('Alert_Later').DoClick();
    }
}

function clrpLogout() {
    //Created By: Josepth 04-01-23
    //Updated by: Angelo 04-13-23 
    Global.DoSleep(5000);
    SeS('CLRP_Burger_List').DoClick();
    SeS('User_Logout').DoClick();
    if (Global.DoWaitFor('Alert_Yes', 2000, 1000)) {
        SeS('Alert_Yes').DoClick();
    }
    WebDriver.Close();
}

function clrpLogoutAdmin() {
    //Created By: Josepth 04-01-23
    SeS('Admin_User_Button').DoClick();
    SeS('User_Logout').DoClick();
    WebDriver.Close();
}

function createRAFTransaction(booktype) {
    //Updated By: Josepth 04-19-23
    //Created By: Josepth 04-01-23
    SeS('CLRP_Register_Document').DoClick();
    Global._DoWaitFor('Generic_Registry_Deeds', 5000, 600);
    SeS('Generic_Registry_Deeds').DoSetText(rd_name);
    Global.DoSleep(1000);
    SeS('Generic_List').DoClick();
    SeS('Generic_Book_Type').DoSetText(booktype);
    Global.DoSleep(1000);
    SeS('Generic_List').DoClick();

    //Disabled Captcha
    SeS('Generic_Captcha').DoSetText("CLRP");
    SeS('Generic_Create').DoClick();
}

function createIRFTransaction() {
    ///Updated By: Josepth 04-19-23
    //Created By: Josepth 04-01-23
    SeS('CLRP_Request_Information').DoClick();
    Global._DoWaitFor('Generic_Registry_Deeds', 5000, 2000);
    SeS('Generic_Registry_Deeds').DoSetText(rd_name);
    Global._DoWaitFor('Generic_List', 5000, 2000);
    SeS('Generic_List').DoClick();

    //Disable Captcha
    SeS('Generic_Captcha').DoSetText("CLRP");
    SeS('Generic_Create').DoClick();
}

function getCurrentValue(type, name) {
    /*
    Created By: Josepth 04-01-2023
    Valid type: clrp,cuba,reporting
    Valid name: apiHostname , showEtdEncode
    */
    Global.DoWaitFor('App_Properties_Dropdown', {
        Type: type
    }, 5000, 600);
    SeS('App_Properties_Dropdown', {
        Type: type
    }).DoClick();
    return SeS('App_Properties_Item', {
        Name: type + '.' + name,
        Column: 2
    }).GetText();
}

function createUniqueMobileNo() {
    var base_MobileNo = '09'
    var num = '' + Math.random();
    var no = num.substring(2, 11);
    MobileNo = base_MobileNo + no;

    return MobileNo;
}

function createUniqueEmail() {
    var basename = 'automation'
    var domain = '@itpi.com.ph'
    var num = '' + Math.random();
    var no = num.substring(2, 8);
    email = basename + no + domain;

    return email;
}

function createUniqueUsername() {
    var basename = 'automation'
    var num = '' + Math.random();
    var no = num.substring(2, 8);
    username = basename + no;

    return username;
}

function darUserAddSearchConditionUsername() {
    SeS('DAR_Add_search_condition').DoClick();
    SeS('DAR_Filter').DoSetText('username');
    SeS('DAR_Filter_Search').DoClick();
    SeS('DAR_Filter_Username').DoClick();
    SeS('RDBrowser_Select').DoClick();
}

function selectRD(rd_name) {
    //Updated By: Alwin = 07/31/2023

    Navigator.SeSFind('//input[@placeholder="Search by RD code or RD name"]').DoClick();
    Navigator.SeSFind('//input[@placeholder="Search by RD code or RD name"]').DoSetText(rd_name);

    SeS('RdBrowser_Generic_List', {
        RDName: rd_name
    }).DoEnsureVisible();
    SeS('RdBrowser_Generic_List', {
        RDName: rd_name
    }).DoClick();
}

function DarUserAddRegistryofDeeds() {
    SeS('DAREditor_ListofRD').DoClick();
    SeS('DAREditor_Add').DoClick();
    selectRD(rd_name);
    SeS('RDBrowser_Select').DoClick();
}

function darUserCreateApproverL2() {
    SeS('DAR_Users').DoClick();
    Global.DoSleep(3000);
    SeS('DAR_Create').DoClick();
    Global.DoSleep(3000);

    Tester.Message('===========Adding Personal Information==============');
    SeS('DAREditor_PersonalInformation').DoClick();
    SeS('PersonalInfo_Firstname').DoSetText('Auto');
    SeS('PersonalInfo_MiddleName').DoSetText('Team');
    SeS('PersonalInfo_LastName').DoSetText('mation');
    createUniqueMobileNo();
    SeS('PersonalInfo_MobileNo').DoSetText(MobileNo);
    createUniqueEmail();
    SeS('PersonalInfo_Email').DoSetText(email);
    SeS('PersonalInfo_HouseNo').DoSetText('233 Looban');
    SeS('PersonalInfo_Barangay').DoSetText('San Juan');
    SeS('PersonalInfo_City').DoSetText('Quezon City');
    SeS('PersonalInfo_ID').DoSetText('SSS ID');
    createUniqueUsername();
    SeS('PersonalInfo_Username').DoSetText(username);

    SeS('PersonalInfo_Role').DoClick();
    SeS('PersonalInfoRole_[LRA_DAR_APPROVER_L2]').DoClick();

    Tester.Message('============Adding Registry of Deeds=========== ');
    DarUserAddRegistryofDeeds();

    SeS('PersonalInfo_OK').DoClick();
}

function darUserCreateApproverL1() {
    SeS('DAR_Users').DoClick();
    Global.DoSleep(3000);
    SeS('DAR_Create').DoClick();
    Global.DoSleep(3000);

    Tester.Message('===========Adding Personal Information==============');
    SeS('DAREditor_PersonalInformation').DoClick();
    SeS('PersonalInfo_Firstname').DoSetText('Auto');
    SeS('PersonalInfo_MiddleName').DoSetText('Team');
    SeS('PersonalInfo_LastName').DoSetText('mation');
    createUniqueMobileNo();
    SeS('PersonalInfo_MobileNo').DoSetText(MobileNo);
    createUniqueEmail();
    SeS('PersonalInfo_Email').DoSetText(email);
    SeS('PersonalInfo_HouseNo').DoSetText('233 Looban');
    SeS('PersonalInfo_Barangay').DoSetText('San Juan');
    SeS('PersonalInfo_City').DoSetText('Quezon City');
    SeS('PersonalInfo_ID').DoSetText('SSS ID');
    createUniqueUsername();
    SeS('PersonalInfo_Username').DoSetText(username);

    SeS('PersonalInfo_Role').DoClick();
    SeS('PersonalInfoRole_[LRA_DAR_APPROVER_L1]').DoClick();

    Tester.Message('============Adding Registry of Deeds=========== ');
    DarUserAddRegistryofDeeds();

    SeS('PersonalInfo_OK').DoClick();
}

function darUserCreateEncoder() {
    SeS('DAR_Users').DoClick();
    SeS('DAR_Create').DoClick();

    Tester.Message('===========Adding Personal Information==============');
    SeS('DAREditor_PersonalInformation').DoClick();
    SeS('PersonalInfo_Firstname').DoSetText('Auto');
    SeS('PersonalInfo_MiddleName').DoSetText('Team');
    SeS('PersonalInfo_LastName').DoSetText('mation');
    createUniqueMobileNo();
    SeS('PersonalInfo_MobileNo').DoSetText(MobileNo);
    createUniqueEmail();
    SeS('PersonalInfo_Email').DoSetText(email);
    SeS('PersonalInfo_HouseNo').DoSetText('233 Looban');
    SeS('PersonalInfo_Barangay').DoSetText('San Juan');
    SeS('PersonalInfo_City').DoSetText('Quezon City');
    SeS('PersonalInfo_ID').DoSetText('SSS ID');
    createUniqueUsername();
    SeS('PersonalInfo_Username').DoSetText(username);

    SeS('PersonalInfo_Role').DoClick();
    SeS('PersonalInfoRole_[LRA_DAR_ENCODER]').DoClick();

    Tester.Message('============Adding Registry of Deeds=========== ');
    DarUserAddRegistryofDeeds();

    SeS('PersonalInfo_OK').DoClick();
}

function enterRAFPresenter() {
    SeS('Generic_Presenter_Tab').DoClick();
    SeS('Generic_Presenter_Name').DoSetText('Automation');
    SeS('Generic_Presenter_Address').DoSetText('Land Registration');
    SeS('Generic_Phone_Number').DoSetText(MobileNo);
    SeS('Generic_ID_Presented').DoSetText('SSS ID');
    //Updated by Carlo 04.27.23
    Global._DoSendKeys('{ENTER}');
    SeS('Generic_Next').DoClick();
}


function enterRAFExecutedBy() {
    SeS('Generic_Executed_By_Tab').DoClick();
    SeS('Generic_Add').DoClick();
    //Updated by Carlo 04.27.23
    SeS('Generic_Next').DoClick();
}

function enterRAFInfavorOf() {
    SeS('Generic_In_FavorOf_Tab').DoClick();
    SeS('InFavor_Of_Textfield').DoSetText('Automation1');
    SeS('Generic_Add').DoClick();
    //Updated by Carlo 04.27.23
    SeS('Generic_Next').DoClick();
}

function enterRAFInfavorOfIssuance() {
    SeS('Generic_In_FavorOf_Tab').DoClick();
    SeS('InFavor_Of_Textfield').DoSetText('Automation1');
    SeS('InFavor_Of_New_OwnerName').DoClick();
    SeS('InFavor_Of_New_OwnerName').DoSendText('Autoamtion2');
    SeS('InFavor_Of_New_OwnerAddresss').DoClick();
    SeS('InFavor_Of_New_OwnerAddresss').DoSendText('Land Registration Systsem');
    SeS('Generic_Add').DoClick();
}

function enterDocumentNotarial() {
    SeS('RL_Document_Notarial_Tab').DoClick();
    SeS('Document_Number').DoSetText('1');
    SeS('Page_Number').DoSetText('2');
    SeS('Book_Number').DoSetText('3');
    SeS('Series_Of').DoSetText('2023');
    SeS('Name_Of_Notary_Public').DoSetText('Automation');
    SeS('Notary_Date').DoSetText('20230401');
    SeS('Place_Of_Notary').DoSetText('Quezon City');
}

function enterRAFDocument() {
    SeS('RL_Document_Tab').DoClick();
}

function enterTitleReference(titleType) {
    SeS('RL_Title_Reference_Tab').DoClick();
    SeS('Title_Type').DoSetText(titleType);
    SeS('Generic_List').DoClick();
    SeS('Title_Number').DoSetText(TitleNo);
    SeS('Generic_Add').DoClick();
}

function enterUserInput(titleType) {
    SeS('User_Input_Tab').DoClick();
    SeS('Title_Type').DoSetText(titleType);
    SeS('Generic_List').DoClick();
    SeS('Title_Number').DoSetText(TitleNo);
    SeS('Number_Of_Copies').DoSetText('1');
    SeS('Generic_Add').DoClick();
}

function enterVerification() {
    SeS('RL_Verification_Tab').DoClick();
    SeS('Email_One').DoSetText(email);
    SeS('Preview').DoClick();
}

function enterULReference() {
    SeS('UL_Reference_Tab').DoClick();
    SeS('UL_No').DoSetText('NEW');
    SeS('Generic_Add').DoClick();
}

function navigateTermsCondition() {
    SeS('Terms_&_Conditions').DoClick();
}

function navigateFAQs() {
    SeS('FAQs').DoClick();
}

function navigateContactUs() {
    SeS('Contact_Us').DoClick();
    SeS('DIV').DoClick();
    SeS('Close').DoClick();
}

function downloadToolInstaller() {
    //CLRP Main - List(Hamburger) - eTD Installers
    SeS('CLRP_Burger_List').DoClick();
    SeS('CLRP_Burger_List_eTD_Installers').DoClick();
    SeS('Philaris_eTD_Tool_Installer').DoClick();
    Tester.CaptureDesktopImage('Tool Installer Downloaded');
}

function downloadXMLFormat() {
    //CLRP Main - List(Hamburger) - eTD Installers
    SeS('CLRP_Burger_List').DoClick();
    SeS('CLRP_Burger_List_eTD_Installers').DoClick();
    SeS('Philaris_eTD_XML_Format').DoClick();
    Tester.CaptureDesktopImage('Tool Installer Downloaded');
}

function darEncoderCreateRequest() {
    //For DAR Encoder User 
    SeS('Dashboard').DoClick();
    SeS('Create_Request').DoClick();
}

function darEncoderTransaction(registry_of_deeds, minor_transaction, surv_plan, number_of_titles) { //For DAR Encoder User
    //Updated:04/12/23 - Mangampo,Pamplina,Meyor
    //Updated:04/17/23 - Pamplina, Angelo
    SeS('Registry_Of_Deeds_Textbox').DoSendKeys(registry_of_deeds);
    SeS('Generic_List').DoClick();
    Global.DoSendKeys('{ENTER}')
    SeS('RoD_Minor_Transaction_Textbox').DoSetText(minor_transaction);
    SeS('Generic_List').DoClick();
    SeS('RoD_Survey_Plan_Number').DoSetText(surv_plan);
    SeS('RoD_Number_Of_Titles').DoSetText(number_of_titles);
    SeS('RoD_Select_Tie_Point').DoClick();
    SeS('STP_Place_Textbox').DoSetText('QUEZON CITY');
    Global.DoSendKeys('{ENTER}');
    SeS('ST_ID_Description_Select').DoClick();
    SeS('STP_Finish_Selection').DoClick();
}


function darEncoderTransactionWithNumberTitles(registry_of_deeds, minor_transaction, surv_plan, number_titles) { //Update by: Jero 05.18
    SeS('Registry_Of_Deeds_Dropdown').DoClick();
    SeS('Registry_Of_Deeds_Textbox').DoSetText(registry_of_deeds);
    Global.DoSendKeys('{ENTER}');
    SeS('RoD_Minor_Transaction_Dropdown').DoClick();
    SeS('RoD_Minor_Transaction_Textbox').DoSetText(minor_transaction);
    Global.DoSendKeys('{ENTER}');
    SeS('RoD_Survey_Plan_Number').DoSetText(surv_plan);
    SeS('RoD_Number_Of_Titles').DoSetText(number_titles);
    SeS('RoD_Select_Tie_Point').DoClick();
    SeS('STP_Place_Textbox').DoSetText('QUEZON CITY');
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Submit_Tie_Point_Place_Select').DoClick();
    SeS('STP_Finish_Selection').DoClick();
}

function enterDARTransaction(minor, num_titles) {
    //Update Function - Josepth 4.13
    Global._DoWaitFor('Registry_Of_Deeds_Textbox', 5000, 650);
    SeS('Registry_Of_Deeds_Textbox').DoSetText(rd_name);
    Global._DoWaitFor('Generic_List', 2000, 650);
    SeS('Generic_List').DoClick();
    SeS('RoD_Minor_Transaction_Textbox').DoSetText(minor);
    Global._DoWaitFor('Generic_List', 2000, 650);
    SeS('Generic_List').DoClick();
    SeS('RoD_Survey_Plan_Number').DoSetText('PSD-9090');
    SeS('RoD_Number_Of_Titles').DoSetText(num_titles);
    //Select Tiepoints
    SeS('RoD_Select_Tie_Point').DoClick();
    Global._DoWaitFor('STP_Place_Textbox', 5000, 650);
    SeS('STP_Place_Textbox').DoSetText('Quezon City');
    Global._DoWaitFor('Generic_List', 2000, 650);
    SeS('Generic_List').DoClick();
    SeS('STP_List').DoClick();
    SeS('STP_Finish_Selection').DoClick();
    //next
    SeS('Generic_Next').DoClick();
}

function enterDARPresenter() {
    //next Auto Populated
    SeS('Generic_Next').DoClick();
}

function enterDARTitleReference(title_type, area, title) {
    //Updated By: Josepth 5.15.23
    Global._DoWaitFor('Title_Type', 5000, 650);
    SeS('Title_Type').DoSetText(title_type);
    Global._DoWaitFor('Generic_List', 5000, 1000);
    SeS('Generic_List').DoClick();
    SeS('Title_Number').DoSetText(title);
    SeS('CCLOA_No.').DoSetText('001');
    SeS('Location_of_Property').DoSetText('TEST');
    SeS('Total_Area').DoSetText(area);
    Global.DoSleep(560);
    SeS('Location_of_Property')._DoClick();
    SeS('Generic_Add').DoClick();
    //Next
    SeS('Generic_Next').DoClick();
}

function enterDARExecutedBy() {
    //next Auto Populated
    Global.DoSleep(2000);
    SeS('Generic_Next').DoClick();
}

function navigateTo(menu) {
    Tester.Assert('User navigate to ' + menu, true);
    return SeS('Admin_Menu', {
        Menu: menu
    });
}

function uploadMultipleXML(num) {
    //Updated By: Josepth 05-15-23
    SeS('ETD_Submit_Upload_eTD_Upload').DoClick(true);
    Global.DoSleep(5000);
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\XML File');
    Global.DoSendKeys('{ENTER}');

    Global._DoWaitFor('Open_Items_View', 5000, 560);
    var items = SeS('Open_Items_View').GetItemCount();
    var x = 0;
    //If num is greater than the items.. 
    num > items ? Tester.FailTest('The items must be less than or equal to num') : null;
    for (var i = 0; i < items; i++) {
        var item_name = SeS('Open_Items_View').GetItemNameByIndex(i);
        if (/^PSD/mi.test(item_name)) {
            SeS('Open_Items_View').DoSelectItem(item_name);
            x++;
            if (x == num) {
                break;
            }
        }
    }
    SeS('Open_Open_Button').DoLClick();
}

function uploadMultipleETD(num) {
    //Updated By: Josepth 05-15-23
    SeS('ETD_Submit_Upload_eTD_Upload').DoClick(true);
    Global.DoSleep(5000);
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\XML File');
    Global.DoSendKeys('{ENTER}');

    Global._DoWaitFor('Open_Items_View', 5000, 560);
    var items = SeS('Open_Items_View').GetItemCount();
    var x = 0;
    //If num is greater than the items.. 
    num > items ? Tester.FailTest('The items must be less than or equal to num') : null;
    for (var i = 0; i < items; i++) {
        var item_name = SeS('Open_Items_View').GetItemNameByIndex(i);
        if (/^PSD/mi.test(item_name)) {
            SeS('Open_Items_View').DoSelectItem(item_name);
            x++;
            if (x == num) {
                break;
            }
        }
    }
    SeS('Open_Open_Button').DoLClick();
}

function enterDARBeneficiariesOLD() {
    //Updated By: Josepth 4-14-23
    Global.DoSleep(3000);
    //Upload eTD
    Global._DoWaitFor('Upload_eTD_Choose_File', 10000);
    SeS('Upload_eTD_Choose_File').DoClick(true);
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\XML File\\PSD-9090_BA_L2_2.xml');
    Global.DoSendKeys('{ENTER}');
    Global.DoWaitFor('PSD-9090_eTDFile', 60000);

    //Upload Image
    SeS('Upload_Scanned_TD_Choose_File').DoClick(true);
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg');
    Global.DoSendKeys('{ENTER}');
    Global.DoWaitFor('Image_ChooseFile', 60000);
    SeS('Name_of_the_Beneficiary').DoSetText('Jihyo Bells');
    SeS('Address').DoSetText('Bacoor Cavite');
    Global.DoSendKeys('{ENTER}');
    SeS('Generic_Add').DoClick();

    //TD Preview
    SeS('TD_Preview').DoClick();
    SeS('Technical_Description_Preview_Screen_Close').DoClick();

    //Next
    SeS('Generic_Next').DoClick();
}

function enterDARBeneficiaries() {
    //Updated By: Alwin 09.12.2023

    SeS('Upload_eTD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\XML File\\PSD-9090_BA_L2_2.xml");
    Global.DoSleep(10000);
    Global.DoSendKeys('{f5}');

    //Upload Image
    SeS('Upload_Scanned_TD').DoClick(true);
    Global.DoSleep(5000);
    SeS('Upload_Scanned_TD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg");

    Global.DoWaitFor('Image_ChooseFile', 60000);
    Global.DoSleep(4000);
    SeS('Technical_Description_Preview_Screen_Close').DoClick();

    SeS('Name_of_the_Beneficiary').DoSetText('Jihyo Bells');
    SeS('Address').DoSetText('Bacoor Cavite');
    Global.DoSleep(3000);
    SeS('Generic_Add').DoClick();
    SeS('Generic_Add').DoClick();

    //TD Preview
    SeS('TD_Preview').DoClick();
    SeS('Technical_Description_Preview_Screen_Close').DoClick();

    //Next
    SeS('Generic_Next').DoClick();
}

function enterDARBeneficiariesCustomXML(xmlFile) {
    //Created  By: Alwin 06/26/23

    //Upload eTD
    SeS('Upload_eTD_Choose_File').DoSendKeys('C:\\Users\\Public\\CLRP\\XML File\\' + xmlFile + '.xml');
    Global.DoSleep(10000);

    //Upload Image
    SeS('Upload_Scanned_TD').DoClick(true);
    Global.DoSleep(5000);
    SeS('Upload_Scanned_TD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg");

    Global.DoWaitFor('Image_ChooseFile', 60000);
    SeS('Technical_Description_Preview_Screen_Close').DoClick();

    SeS('Name_of_the_Beneficiary').DoSetText('Jihyo Bells');
    SeS('Address').DoSetText('Bacoor Cavite');
    Global.DoSleep(3000);
    SeS('Generic_Add').DoClick();
    SeS('Generic_Add').DoClick();

    //TD Preview
    SeS('TD_Preview').DoClick();
    SeS('Technical_Description_Preview_Screen_Close').DoClick();

    //Next
    SeS('Generic_Next').DoClick();
}

function uploadScannedTD() {

    //Upload Image
    SeS('Upload_Scanned_TD').DoClick(true);
    Global.DoSleep(5000);
    SeS('Upload_Scanned_TD_Choose_File').DoSendKeys("C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg");

    Global.DoWaitFor('Image_ChooseFile', 60000);
    SeS('Technical_Description_Preview_Screen_Close').DoClick();

    SeS('Name_of_the_Beneficiary').DoSetText('Jihyo Bells');
    SeS('Address').DoSetText('Bacoor Cavite');
    Global.DoSleep(3000);
    SeS('Generic_Add').DoClick();
    SeS('Generic_Add').DoClick();
}

function enterDARDocument() {
    var count = SeS('Document_Table').DoDOMChildrenCount();

    //Select all documents
    for (var i = 1; i <= count; i++) {
        SeS('Document_Available', {
            Row: i
        }).DoClick();
    }
    Global.DoSleep(2000);
    SeS('Document_Submit').DoClick();
    SeS('Alert_Yes').DoClick();
}

function filterTransaction() {
    //Updated By: Josepth 04-17-23
    Global._DoWaitFor('Filter_Transaction_Number', 5000, 2000);
    SeS('Filter_Transaction_Number')._DoRClick();
    SeS('Filter_Descending')._DoClick();
}

function getDARTransactionNumber() {
    filterTransaction();
    Global.DoSleep(5000);
    transaction_num = SeS('Request_Transaction_Number').GetText();
    Tester.Message('Your transaction number is ' + transaction_num);
}

function viewDARTransaction() {
    //Updated By: Josepth 04-14-23
    //Updated By: Josepth 04-14-23	
    //Wait for Object
    filterTransaction();
    Global._DoWaitFor('Request_Action_View', {
        TNumber: transaction_num
    }, 5000, 650);

    //Click View transaction
    SeS('Request_Action_View', {
        TNumber: transaction_num
    }).DoClick();
}

function approveDARTransaction() {
    //Updated By: Josepth 04-14-23
    //Updated By: Josepth 04-17-23		
    //Wait for Object
    filterTransaction();
    Global.DoSleep(3000);
    Global._DoWaitFor('Request_Action_Approve', {
        TNumber: transaction_num
    }, 5000, 1000);

    //Click Approve Action
    SeS('Request_Action_Approve', {
        TNumber: transaction_num
    }).DoClick();

    SeS('Alert_Yes').DoClick();
    SeS('Request_Password').DoSetText(password);
    SeS('Alert_Ok').DoClick();
}

function reviewDARDocument() {
    //Updated By: Josepth 04-14-23
    //Review
    Tester.Message('Navigate Document');
    SeS('Document_Ok').DoClick();
}

function enterETDUpload(rd_name, NoParcels) {
    SeS('ETD_Submit_RegistryOfDeeds').DoClick();
    Global.DoSendKeys(rd_name);
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Submit_PlanNumber').DoSetText('PSD-9090');
    SeS('ETD_Submit_No.Parcels').DoSetText(NoParcels);
}

function enterETDTiepoint() {
    //Updated By: Josepth 04-19-23
    SeS('ETD_Submit_Select_Tie_Point').DoClick();
    SeS('ETD_Submit_Tie_Point_Place').DoClick();
    SeS('STP_Place_Textbox').DoSendKeys('QUEZON CITY');
    Global._DoWaitFor('Generic_List', 5000, 2000);
    SeS('Generic_List').DoClick();
    SeS('ETD_Submit_Tie_Point_Place_Select').DoClick();
    SeS('ETD_Submit_Tie_Point_Finish_Selection').DoClick();
}

function selectOptionUploadETD() {
    //Updated By: Alwin 09/12/23
    SeS('ETD_Submit_Upload_eTD').DoClick();

}

function uploadXMLFile() {
    //Updated By: Alwin 09/12/23
    SeS('ETD_Submit_Upload_eTD_Upload').DoSendKeys("C:\\Users\\Public\\CLRP\\XML File\\PSD-9090_BA_L2_2.xml");
    Global.DoSleep(10000);

}

function selectOptionEncodeETD() {
    SeS('ETD_Submit_Encode_eTD').DoClick();
    Global.DoSleep(1000);
    SeS('ETD_Submit_Encode_eTD_EncodeETD').DoClick();
}

function enterPlanInformationEncodeETD() {
    SeS('ETD_Block_No').DoSetText('55');
    SeS('ETD_Lot_No').DoSetText('19');
    SeS('ETD_Portion_of').DoSetText('Automation Testing');
    SeS('ETD_Location').DoSetText('Quezon City');
    SeS('ETD_Area').DoSetText('100');
    SeS('ETD_Unit_of_Measure').DoClick();
    Global.DoSendKeys('Square Meters');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Description_of_Corners').DoSetText('Description Corners');
    SeS('ETD_Survey_System').DoSetText('Surver Testing');
    SeS('ETD_Bearing').DoClick();
    Global.DoSendKeys('True');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_LRC/Records_No').DoSetText('8623');
    SeS('ETD_Declination').DoSetText('Automation');
    SeS('ETD_DateOf_Orginal_Survey').DoSetText('01/04/2023');
    SeS('ETD_DateOf_Survey_Executed').DoSetText('01/04/2023');
    SeS('ETD_DateOf_Survey_Approved').DoSetText('01/04/2023');
    SeS('ETD_Geodetic_Engineer').DoSetText('Test');
    SeS('ETD_Notes').DoSetText('Test Notes');
}

function enterPlanInformationEncodeTitlePolygon() {
    SeS('ETD_Add_Corners').DoSetText('4');
    SeS('ETD_Add').DoClick();
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

function eTDUploadSubmit() {
    // Updated by: Andilab 04.24.23
    SeS('ETD_Submit_Submit').DoClick();
    SeS('ETD_Alert_Yes').DoClick();
    SeS('ETD_Alert_OK').DoClick();
    Tester.CaptureDesktopImage('Print preview transaction');
    SeS('ViewTrans_View_Preview_Close').DoClick();
    SeS('Home').DoLClick();
    Tester.CaptureDesktopImage('Pop up Alert');
    SeS('Home').DoLClick();
    Tester.CaptureDesktopImage('Pop up Alert');
}

function eTDUploadSave() {
    SeS('ETD_Submit_Save').DoClick();
    Tester.CaptureDesktopImage('eTD Upload Saved as draft');
    SeS('ETD_Alert_OK').DoClick();
}

function viewTransactionReport() {
    Global.DoWaitFor('ViewTrans_View', 5000, 2000);
    SeS('ViewTrans_View').DoClick();
    Global.DoSleep(5000);
    Tester.CaptureDesktopImage('Print preview transaction');
    SeS('ViewTrans_View_Preview_Close').DoClick();
}

function viewTransactionUpdate() {
    SeS('Select_Transaction').DoClick();
    SeS('ViewTrans_Update').DoClick();
}

function viewTransactionRemove() {
    SeS('Select_Transaction').DoClick();
    SeS('ViewTrans_Remove').DoClick();
    SeS('ETD_Alert_Yes').DoClick();
}

function accountReportView() {
    Global.DoSleep(1000);
    SeS('Account_Report_Excel').DoClick();
    Global.DoSleep(4000);
    Tester.CaptureDesktopImage('Users in different status displayed');
}

function getDateToday() {
    //Created By: Joven 04-04-23
    var dt = new Date();
    return formatDate(dt);
}

function etdApplicationFormPDFFileName() {
    var dt = new Date();
    return Tester.GetTestName() + '_eTD Application Form' + dt.getHours() + '_' + dt.getMinutes() + '_' + dt.getSeconds() + '.pdf';
}

function getDateAddByDay(day) {
    //Created By: Joven 04-04-23
    var dt = new Date();
    dt.setDate(dt.getDate() + day);
    return formatDate(dt);
}

function getDateAddByMonth(months) {
    //Created By: Joven 04-04-23
    var dt = new Date();
    dt.setMonth(dt.getMonth() + months);
    return formatDate(dt);
}

function formatDate(dt) {
    //Created By: Joven 04-04-23
    var month = (dt.getMonth() + 1);
    var formatMonth = month < 10 ? '0' + month : month;
    var date = dt.getDate();
    var formatDate = date < 10 ? '0' + date : date;
    var year = dt.getFullYear();

    return year + '-' + formatMonth + '-' + formatDate;
}

function applicationHitsReportsGenerate() {
    //Created By: Joven 04-04-23
    SeS('Application_Hits_Report_NV_DateFrom').DoSetText(getDateAddByDay(-4));
    SeS('Application_Hits_Report_NV_DateTo').DoSetText(getDateToday());
    Global.DoSleep(2000)
    SeS('Application_Hits_Report_NV_Generate').DoClick();
    Tester.CaptureDesktopImage('Number of Visitors Generated');
    Global.DoSleep(5000)
    SeS('Application_Hits_Report_NL_DateFrom').DoSetText(getDateAddByDay(-2));
    SeS('Application_Hits_Report_NL_DateTo').DoSetText(getDateToday());
    SeS('Application_Hits_Report_NL_Generate').DoClick();
    Tester.CaptureDesktopImage('Number of Login Generated');
    Global.DoSleep(5000)
}

function transactionVolumeReport() {
    //Created By: Joven 04-04-23
    SeS('Transaction_Volume_Report_From_Date').DoSetText(getDateAddByDay(-8));
    SeS('Transaction_Volume_Report_To_Date').DoSetText(getDateToday());
    SeS('Transaction_Volume_Report_RD').DoSetText(rd_name);
    Global.DoSendKeys('{PGDN}');
    Global.DoSendKeys('{ENTER}');
    SeS('Transaction_Volume_Report_Book_Type').DoSetText('Registered Land');
    Global.DoSendKeys('{PGDN}');
    Global.DoSendKeys('{ENTER}');
    SeS('Transaction_Volume_Report_Major_Transactions').DoSetText('Annotation on Certificate of Title in Subsequent Registration');
    Global.DoSendKeys('{PGDN}');
    Global.DoSendKeys('{ENTER}');
    SeS('Transaction_Volume_Report_Minor_Transactions').DoSetText('Affidavit');
    Global.DoSendKeys('{PGDN}');
    Global.DoSendKeys('{ENTER}');
    SeS('Transaction_Volume_Report_Generate').DoClick();
    SeS('Transaction_Volume_Report_Excel').DoClick();
    Global.DoSleep(5000)
    Tester.CaptureDesktopImage('Transaction Volume Report Generated');
}

function partnerInstitutionCreateLogo() {
    //For Setup partner Institution Admin User
    SeS('Partner_Institution_Create').DoClick();
    SeS('Partner_Institution_Choose_File').DoClick();
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg');
    Global.DoSleep(2000);
    Global.DoSendKeys('{ENTER}');
    Global.DoSleep(2000);
    SeS('Partner_Institution_Name').DoSetText('ForTesting');
    Global.DoSleep(5000);
    SeS('Partner_Institution_Ok').DoDblClick();
    Global.DoSleep(5000);
    Tester.CaptureDesktopImage("Create Partner Institution Logo");
}

function partnerInstitutionRemoveLogo() {
    //For Setup partner Institution Admin User
    SeS('Partner_Institution_Refresh').DoClick();
    Global.DoSleep(2000);
    Global.DoSendKeys('{DOWN}');
    Global.DoSendKeys('{DOWN}');
    Global.DoSendKeys('{DOWN}');
    Global.DoSendKeys('{DOWN}');
    Global.DoSleep(5000);
    SeS('Partner_Institution_Removed').DoClick();
    SeS('Confirmation_Yes').DoClick();
    Global.DoSleep(5000);
    Tester.CaptureDesktopImage("Partner Institution Logo Remove");
}

function partnerInstitutionEditLogoAndName() {
    //For Setup partner Institution Admin User
    SeS('Partner_Institution_Refresh').DoClick();
    Global.DoSleep(2000);
    Global.DoSendKeys('{ENTER}');
    Global.DoSendKeys('{DOWN}');
    Global.DoSendKeys('{DOWN}');
    Global.DoSendKeys('{DOWN}');
    Global.DoSendKeys('{DOWN}');
    SeS('Partner_Institution_Edit').DoClick();
    Global.DoSleep(5000);
    Tester.CaptureDesktopImage("Partner Institution Logo Before Edit Logo And Name");
    Global.DoSleep(2000);
    SeS('Partner_Institution_Name').DoSetText('TESTING ONLY');
    SeS('Partner_Institution_Choose_File').DoClick();
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\For Uploading\\Image2.jpg');
    Global.DoSleep(2000);
    Global.DoSendKeys('{ENTER}');
    Global.DoSleep(2000);
    SeS('Partner_Institution_Ok').DoDblClick();
    Global.DoSleep(5000);
    Tester.CaptureDesktopImage("Partner Institution Logo After Edit Logo And Name");
}

function partnerInstitutionEditName() {
    //For Setup partner Institution Admin User
    SeS('Partner_Institution_Refresh').DoClick();
    Global.DoSleep(2000);
    Global.DoSendKeys('{ENTER}');
    Global.DoSendKeys('{DOWN}');
    SeS('Partner_Institution_Edit').DoClick();
    Global.DoSleep(5000);
    Tester.CaptureDesktopImage("Partner Institution Before Edit Name");
    Global.DoSleep(2000);
    SeS('Partner_Institution_Name').DoSetText('USE FOR TESTING ONLY');
    SeS('Partner_Institution_Ok').DoDblClick();
    Global.DoSleep(5000);
    Tester.CaptureDesktopImage("Partner Institution After Edit Name");
}

function partnerInstitutionEditLogo() {
    //For Setup partner Institution Admin User
    SeS('Partner_Institution_Refresh').DoClick();
    Global.DoSleep(2000);
    Global.DoSendKeys('{ENTER}');
    SeS('Partner_Institution_Edit').DoClick();
    SeS('Partner_Institution_Choose_File').DoClick();
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg');
    Global.DoSleep(2000);
    Global.DoSendKeys('{ENTER}');
    Global.DoSleep(2000);
    SeS('Partner_Institution_Ok').DoDblClick();
    Global.DoSleep(5000);
    Tester.CaptureDesktopImage("Partner Institution Logo After Edit Logo");
}

function encodeETD() {
    SeS('ETD_Add_Corners').DoSetText('4');
    SeS('ETD_Add').DoClick();
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

function submitETD() {
    //Updated by: Alwin - 041923
    SeS('ETD_Submit_Submit').DoClick();
    SeS('ETD_Alert_Yes').DoClick();
    SeS('ETD_Alert_OK').DoClick();
    Global.DoSleep(5000);
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Barcode and Reference');
    Global.DoSendKeys('{ESC}');
    SeS('ETD_Submit_Notif').DoClick();
    SeS('ETD_Upload_Success').DoClick();
}

function enterPlanInformationEncodeETDUniqueBlockAndLot() {
    var blk = '' + Math.random();
    var block = blk.substring(2, 5);
    var lt = '' + Math.random();
    var lot = lt.substring(2, 5);

    SeS('ETD_Block_No').DoSetText(block);
    SeS('ETD_Lot_No').DoSetText(lot);
    SeS('ETD_Portion_of').DoSetText('Automation Testing');
    SeS('ETD_Location').DoSetText('Quezon City');
    SeS('ETD_Area').DoSetText('100');
    SeS('ETD_Unit_of_Measure').DoClick();
    Global.DoSendKeys('Square Meters');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Description_of_Corners').DoSetText('Description Corners');
    SeS('ETD_Survey_System').DoSetText('Surver Testing');
    SeS('ETD_Bearing').DoClick();
    Global.DoSendKeys('True');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_LRC/Records_No').DoSetText('8623');
    SeS('ETD_Declination').DoSetText('Automation');
    SeS('ETD_DateOf_Orginal_Survey').DoSetText('01/04/2023');
    SeS('ETD_DateOf_Survey_Executed').DoSetText('01/04/2023');
    SeS('ETD_DateOf_Survey_Approved').DoSetText('01/04/2023');
    SeS('ETD_Geodetic_Engineer').DoSetText('Test');
    SeS('ETD_Notes').DoSetText('Test Notes');
}

function darEncoderBeneficiaries() {
    SeS('Generic_Next').DoClick();
    SeS('DAR_Encoder_Beneficiaries').DoClick();
    SeS('Name_of_the_Beneficiary').DoSetText('AUTOMATION');
    SeS('Address').DoSetText('QUEZON CITY');
}

function darEncoderUploadeTD() {
    SeS('Upload_eTD_Choose_File').DoClick();
    Global.DoSleep(5000);
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\XML File\\PSD-9090_BA_L2_2.xml');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
}

function darEncoderUploadScannedTD() {
    SeS('Upload_Scanned_TD_Choose_File').DoClick(true);
    Global.DoSleep(5000);
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\For Uploading\\Image.jpg');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('DAR_Beneficiaries_Add_Entry').DoClick();
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Beneficiaries Successfully Added');
}

function darEncoderTDPreview() {
    SeS('TD_Preview').DoClick();
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Beneficiaries Successfully Added');
    SeS('Technical_Description_Preview_Screen_Close').DoClick();
}

function darApproverView() { //For DAR Approver User 
    //updated by: Alwin 06/27/23

    SeS('Dashboard').DoClick();
    Global._DoWaitFor('Approver_View', 10000, 1500);
    SeS('Approver_View').DoClick();
    //SeS('Approver_View').DoDblClick();
}

function darApproverViewTransaction() { //For DAR Approver User 
    // Update by: Jero 04/20/23
    SeS('Generic_Presenter_Tab').DoClick(true);
    Global.DoSleep(3000);
    SeS('DAR_Encoder_Title_Reference').DoClick(true);
    Global.DoSleep(3000);
    SeS('DAR_Encoder_Executed_By').DoClick(true);
    Global.DoSleep(3000);
    SeS('DAR_Encoder_Beneficiaries').DoClick(true);
    Global.DoSleep(3000);
    SeS('DAR_Encoder_Document').DoClick(true);
    Global.DoSleep(3000);
    SeS('DAR_OK').DoClick(true);
    Global.DoSleep(3000);
}

function darApproverApproveTransaction() { //For DAR Approver User 
    Global.DoSleep(1000);
    SeS('Approver_Approve').DoClick();
    SeS('Approver_Confirm_Yes').DoClick();
    SeS('Approver_Confirm_Password').DoSetText(password);
    SeS('DAREditor_ErrorOK').DoClick();
}

function darEncoderPrint() { //For DAR Encoder User 
    //Updated By: Josepth 05-16-23
    //Updated By: Alwin 07-31-23
    SeS('Dashboard').DoClick();

    Global._DoWaitFor('Encoder_Print', {
        TNumber: transaction_num
    }, 5000, 650);

    //Click View transaction
    SeS('Encoder_Print', {
        TNumber: transaction_num
    }).DoClick();

    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('View PDF Details');
    SeS('Approver_Print _Close').DoClick();
}

function enterDARTransactionWithSingleTitle(minor) {
    Global._DoWaitFor('Registry_Of_Deeds_Textbox', 5000, 650);
    SeS('Registry_Of_Deeds_Textbox').DoSetText(rd_name);
    Global._DoWaitFor('Generic_List', 2000, 650);
    SeS('Generic_List').DoClick();
    SeS('RoD_Minor_Transaction_Textbox').DoSetText(minor);
    Global._DoWaitFor('Generic_List', 2000, 650);
    SeS('Generic_List').DoClick();
    SeS('RoD_Survey_Plan_Number').DoSetText('PSD-9090');
    SeS('RoD_Number_Of_Titles').DoSetText('1');

    //Select Tiepoints
    SeS('RoD_Select_Tie_Point').DoClick();
    Global._DoWaitFor('STP_Place_Textbox', 5000, 650);
    SeS('STP_Place_Textbox').DoSetText('Quezon City');
    Global._DoWaitFor('Generic_List', 2000, 650);
    SeS('Generic_List').DoClick();
    SeS('STP_List').DoClick();
    SeS('STP_Finish_Selection').DoClick();

    //next
    SeS('Generic_Next').DoClick();
}

function closeEncodeETD() {
    SeS('ETD_Close').DoClick();
}

function enterETDUpload2(rd_name, Parcels) {
    SeS('ETD_Submit_RegistryOfDeeds').DoClick();
    Global.DoSendKeys(rd_name);
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Submit_PlanNumber').DoSetText('PSD-9090');
    SeS('ETD_Submit_No.Parcels').DoSetText(Parcels);
}

function enterETDUploadCustomPlanNumber(rd_name, noParcels, planNumber) {
    SeS('ETD_Submit_RegistryOfDeeds').DoClick();
    Global.DoSendKeys(rd_name);
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Submit_PlanNumber').DoSetText(planNumber);
    SeS('ETD_Submit_No.Parcels').DoSetText(noParcels);
}

function reviewDARTransaction() {
    //Review
    Tester.Message('Navigate Transaction');
    SeS('Generic_Next').DoClick();
}

function reviewDARPresenter() {
    //Review
    Tester.Message('Navigate Presenter');
    SeS('Generic_Next').DoClick();
}

function reviewDARTitleReference() {
    //Review
    Tester.Message('Navigate Title Reference');
    SeS('Generic_Next').DoClick();
}

function reviewDARExecutedBy() {
    //Review
    Tester.Message('Navigate Executed By');
    SeS('Generic_Next').DoClick();
}

function reviewDARBeneficiaries() {
    //Review
    Tester.Message('Navigate Beneficiaries');
    SeS('Generic_Next').DoClick();
}

function reviewDAR() {
    viewDARTransaction();
    reviewDARTransaction();
    reviewDARPresenter();
    reviewDARTitleReference();
    reviewDARExecutedBy();
    reviewDARBeneficiaries();
    reviewDARDocument();
}

function updateDARTransaction() {
    //Updated By: Josepth 04-17-23
    //Wait for object
    filterTransaction();
    Global._DoWaitFor('Request_Action_Update', {
        TNumber: transaction_num
    }, 5000, 650);

    //Click Update Button
    SeS('Request_Transaction_Number')._DoClick();
    SeS('Request_Action_Update', {
        TNumber: transaction_num
    }).DoClick();

    //Remarks Screen close
    SeS('Approver_Print _Close').DoClick();
}

function returnDARToEncoder() {
    //Updated By: Josepth 04-17-23	
    //Wait for Object
    filterTransaction();
    Global._DoWaitFor('Request_Action_Return', {
        TNumber: transaction_num
    }, 5000, 560);

    //Click Return to Encoder
    SeS('Request_Action_Return', {
        TNumber: transaction_num
    }).DoClick();

    enterRemarks();
}

function enterRemarks() {
    SeS('Approver_Remarks').DoSetText('Send to Encoder');
    SeS('Alert_Ok').DoClick();
}

function getDateMinusByMonth(months) {
    //Created By: Joven 04-13-23
    var dt = new Date();
    dt.setMonth(dt.getMonth() - months);
    return formatDate(dt);
}

function view_Transaction_Status() {
    SeS('CLRP_View_Transaction').DoClick();
}

function registration_Application_Form() {
    SeS('CLRP_Register_Document').DoClick();
}

function request_Information_Form() {
    SeS('CLRP_Request_Information').DoClick();
}

function submit_ETD() {
    SeS('CLRP_Submit_ETD').DoClick();
}

function navigateManuals() {
    SeS('Manuals').DoClick();
}

function downloadRLDeedOfSale() {
    SeS('RLDeedOfSaleDownloadButton').DoClick();
}

function downloadRLSpecialPowerofAttorney() {
    SeS('RLSpecialPowerofAttorneyDownloadButton').DoClick();
}

function downloaadRLRealEstateMortgage() {
    SeS('RLRealEstateMortgageDownloadButton').DoClick();
}

function downloadULDeedOfSale() {
    SeS('ULDeedOfSaleDownloadButton').DoClick();
}

function downloadULSpecialPowerofAttorney() {
    SeS('ULSpecialPowerofAttorneyDownloadButton').DoClick();
}

function downloadULRealEstateMortgage() {
    SeS('ULRealEstateMortgageDownloadButton').DoClick();
}

function EnterPlanInformationEncodeETDCustomBlkAndLot(Block, Lot) {
    SeS('ETD_Block_No').DoSetText(Block);
    SeS('ETD_Lot_No').DoSetText(Lot);
    SeS('ETD_Portion_of').DoSetText('Automation Testing');
    SeS('ETD_Location').DoSetText('Quezon City');
    SeS('ETD_Area').DoSetText('100');
    SeS('ETD_Unit_of_Measure').DoClick();
    Global.DoSendKeys('Square Meters');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Description_of_Corners').DoSetText('Description Corners');
    SeS('ETD_Survey_System').DoSetText('Surver Testing');
    SeS('ETD_Bearing').DoClick();
    Global.DoSendKeys('True');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_LRC/Records_No').DoSetText('8623');
    SeS('ETD_Declination').DoSetText('Automation');
    SeS('ETD_DateOf_Orginal_Survey').DoSetText('01/04/2023');
    SeS('ETD_DateOf_Survey_Executed').DoSetText('01/04/2023');
    SeS('ETD_DateOf_Survey_Approved').DoSetText('01/04/2023');
    SeS('ETD_Geodetic_Engineer').DoSetText('Test');
    SeS('ETD_Notes').DoSetText('Test Notes');
    Tester.CaptureDesktopImage('Plan Informations');
}

function uploadInvalidXMLFile() {
    Global.DoSendKeys('C:\\Users\\Public\\CLRP\\XML File\\PSD-9090_BA_L6_6.xml')
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    Tester.CaptureDesktopImage('Error Message');
    SeS('ETD_Alert_OK').DoClick();
}

function printDAREncoder() {
    SeS('MyRequest_Status_Label').DoClick();
    Global.DoSleep(2000);
    SeS('MyRequest_Status_Label').DoClick();
    SeS('Encoder_Print').DoClick();
    downloadDARForm();
    Global.DoSleep(5000);
    Tester.CaptureDesktopImage('Print Transaction');
    Global.DoSleep(3000);
    Global.DoSendKeys('{ESC}');
    Global.DoSendKeys('{ESC}');
}

function downloadDARForm(){

	 var index = 8;
	 prefix = "DAR Form";
	 
    Global.DoSendKeys('^j');
    Global.DoSendKeys('^w');
    
    // Download the file
    for (var i = 0; i < index; i++) {
        Global.DoSendKeys('{TAB}');
    }
    Global.DoSendKeys('{ENTER}');

    // Get the current date and time
    var dt = new Date();
    var year = dt.getFullYear();
    var month = (dt.getMonth() + 1 < 10 ? '0' : '') + (dt.getMonth() + 1);
    var day = (dt.getDate() < 10 ? '0' : '') + dt.getDate();
    var hours = (dt.getHours() < 10 ? '0' : '') + dt.getHours();
    var minutes = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
    var seconds = (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds();

    var formattedDateTime = year + '-' + month + '-' + day + '_' + hours + '_' + minutes + '_' + seconds;
   	Global.DoSleep(5000);

    // Specify the file name with the given prefix
    var fileName = prefix + "-" + formattedDateTime + ".pdf";
    Global.DoSendKeys(fileName);
    Global.DoSendKeys('{ENTER}');
    Global.DoSleep(10000);  // Increased sleep to ensure download completion

    var TCID = Tester.GetTestName();
    Tester.Message("Test Case ID: " + TCID);

    // Define source and destination
    var shell = new ActiveXObject("WScript.Shell");
    var userProfile = shell.ExpandEnvironmentStrings("%USERPROFILE%");
    var sourceFolder = userProfile + "\\Downloads\\";
    var dateToday = year + '-' + month + '-' + day;
    var sourceFile = sourceFolder + fileName;
    var destinationFolder = "C:\\Users\\Public\\CLRP\\Reports\\" + dateToday + "\\" + TCID + "\\";
    var destinationFile = destinationFolder + fileName;

    var fso = new ActiveXObject("Scripting.FileSystemObject");

    // Verify if the source file exists before moving
    if (fso.FileExists(sourceFile)) {
        Tester.Message("Source file exists: " + sourceFile);

        // Specify the path for the batch file
        var batchFileName = "moveFiles.bat";
        var batchFilePath = "C:\\Users\\Public\\CLRP\\" + batchFileName;

        // Open the batch file for writing
        var textfile = fso.OpenTextFile(batchFilePath, 2, true);

        // Write the commands to the batch file
        textfile.WriteLine("@echo off");
        textfile.WriteLine("if not exist \"" + destinationFolder + "\" mkdir \"" + destinationFolder + "\"");
        textfile.WriteLine("set \"source=" + sourceFile + "\"");
        textfile.WriteLine("set \"destination=" + destinationFile + "\"");
        textfile.WriteLine("move \"%source%\" \"%destination%\"");

        // Close the batch file
        textfile.Close();
		Global.DoSleep(2000); 
        // Launch the batch file
        Global.DoLaunch(batchFilePath);
        Global.DoSleep(10000);  // Increased sleep to ensure the move operation completes

        // Check if the destination file exists after moving
        if (fso.FileExists(destinationFile)) {
            Tester.Message("File moved successfully to: " + destinationFile);

            // Set Data in Spreadsheet
            setDataSpreadsheet(fileName, "File Name");
            setDataSpreadsheet(destinationFile, "Location");

            // Get the path of the PDF and extract the Transaction number
            Tester.Message("Destination file: " + destinationFile);

            var fullPath = destinationFile;
            Tester.Message("Full Path: " + fullPath);

            var text = PDF2_GetFullText(fullPath);
            if (text) {
                Tester.Message("PDF Text: " + text);

                // Extract the CLRP Reference Number
                var clrpReferenceNumber = extractCLRPReferenceNumberDAR(text);

                // Log the result 
                if (clrpReferenceNumber) {
                    Tester.Message("CLRP Reference Number: " + clrpReferenceNumber);
                } else {
                    Tester.Message("CLRP Reference Number not found.");
                }

                // Set the CLRP Reference number in Spreadsheet
                setDataSpreadsheet(clrpReferenceNumber, "CLRP Reference Number");
            } else {
                Tester.Message("Failed to extract text from PDF.");
            }
        } else {
            Tester.Message("Error: File does not exist after moving - " + destinationFile);
        }
    }
    else {
        Tester.Message("Error: Source file does not exist - " + sourceFile);
        
        // List all files in the Downloads folder for debugging
        var files = [];
        var e = new Enumerator(fso.GetFolder(sourceFolder).Files);
        for (; !e.atEnd(); e.moveNext()) {
            var file = e.item();
            files.push({
                name: file.Name,
                created: file.DateCreated
            });
        }

        // Sort files by creation date descending
        files.sort(function(a, b) {
            return b.created - a.created;
        });

        // Log sorted files
        for (var i = 0; i < files.length; i++) {
            Tester.Message("File in Downloads folder: " + files[i].name + ", Created: " + files[i].created);
        }
    }
}

function extractCLRPReferenceNumberDAR(text) {
    // Adjust the regular expression pattern to match the desired format
    var pattern = /CLRP-\d{14}/;
    var match = text.match(pattern);
    if (match) {
        return match[0];
    } else {
        return null;
    }
}


function reviewDARForReworkTransaction() {
    reviewDARTransaction();
    reviewDARPresenter();
    reviewDARTitleReference();
    reviewDARExecutedBy();
    reviewDARBeneficiaries();
    reviewDARDocumentWithRemarks();
}

function reviewDARDocumentWithRemarks() {
    SeS('Document_Submit').DoClick();
    SeS('Approver_Remarks').DoSetText('Send to Approver');
    SeS('Alert_Ok').DoClick();
    SeS('Alert_Yes').DoClick();
}

function navigateToUserProfile() {
    SeS('CLRP_Burger_List').DoClick();
    SeS('CLRP_Burger_List_User_Profile').DoClick();
}

function navigateToUpdateUserProfile() {
    SeS('User_Profile_Dropdown').DoClick();
    SeS('User_Profile_Update_User_Profile').DoClick();


}

function getUserProfileInformation() {
    userProfileUsername = SeS('User_Profile_Username').GetValue();
    userProfileFirstName = SeS('User_Profile_First_Name').GetValue();
    userProfileLastName = SeS('User_Profile_Last_Name').GetValue();
    userProfileMobileNumber = SeS('User_Profile_Mobile_Number').GetValue();
    userProfileEmail = SeS('User_Profile_Email').GetValue();
}

function closeUserProfileWindow() {
    SeS('User_Profile_Close').DoClick();
}

function changePassword() {
    SeS('User_Profile_Change_Password').DoClick();
    num = Math.floor(Math.random() * 10000);
    newPassword = 'Pass@123' + num;
    SeS('Change_Password_Current_password').DoSetText(password);
    SeS('Change_Password_New_Password').DoSetText(newPassword);
    SeS('Change_Password_Confirm_New_Password').DoSetText(newPassword);
    SeS('Change_Password_OK').DoClick();
    Tester.CaptureDesktopImage('Password successfully changed.');
    SeS('Change_Password_Success_OK').DoClick();

    var fso, textfile;
    fso = new ActiveXObject("Scripting.FileSystemObject");
    var textFilePath = "C:\\Users\\Public\\CLRP\\CLRPCredentials.txt";
    // Open the text file for writing
    var textfile = fso.OpenTextFile(textFilePath, 2, true);

    // Write the commands to the batch file
    textfile.WriteLine("Individual_UserChangePass");
    textfile.WriteLine("autoclrpchangepass");
    textfile.WriteLine(newPassword);


    // Close the batch file
    textfile.Close();
}

function clrpLogoutPublicUser() {
    SeS('Home').DoClick();
    SeS('CLRP_Burger_List').DoClick();
    SeS('User_Logout').DoClick();

}

function validateObjectDoesNotExist(objectID) {

    if (Navigator.CheckObjectExists(objectID) == true) {
        Tester.FailTest(objectID + ' is displayed');
    } else {
        Tester.Message(objectID + ' is not displayed');
    }
}

function validateObjectDoesExist(objectID) {

    if (Navigator.CheckObjectExists(objectID) == false) {
        Tester.FailTest(objectID + ' is not displayed');
    } else {
        Tester.Message(objectID + ' is displayed');
    }
}

function addSearchCondition(condition) {
    SeS('DAR_Add_search_condition').DoClick();
    SeS('DAR_Filter').DoSetText(condition);
    SeS('DAR_Filter_Search').DoClick();
    SeS('DAR_Filter_Username').DoClick();
    SeS('RDBrowser_Select').DoClick();
}

function approveReturnToEncoder() {
    SeS('Approve_Return_To_Encoder').DoClick();
    SeS('Approver_Remarks').DoSetText('Return to Encoder');
    Tester.CaptureDesktopImage('Return to Encoder');
    SeS('DAR_Remarks_Ok').DoClick();
}

function darEncoderViewTransaction() {
    SeS('Dashboard').DoClick();
    SeS('ViewTransaction_Select_Transaction').DoClick();
    SeS('Request_Action_Update').DoClick();
    Global.DoSendKeys('{ESC}');
    SeS('Generic_Next').DoClick(true);
    SeS('Generic_Next').DoClick(true);
    SeS('Generic_Next').DoClick(true);
    SeS('Generic_Next').DoClick(true);
    SeS('Generic_Next').DoClick(true);
    SeS('Generic_Submit').DoClick(true);
    SeS('Approver_Remarks').DoSetText('Submit');
    Tester.CaptureDesktopImage('Submit');
    SeS('DAR_Remarks_Ok').DoClick();
    SeS('Alert_Yes').DoClick();
    Global.DoSleep(3000);
}

function enterIRFTransaction(minor) {
    Global._DoWaitFor('Minor_Transaction_Text', 5000, 2000);
    SeS('Minor_Transaction_Text').DoSendKeys(minor);
    Global._DoWaitFor('Generic_List', 5000, 3000);
    SeS('Generic_List')._DoClick();
    SeS('Generic_Next').DoClick();
}

function enterIRFPresenter() {
    SeS('Generic_Presenter_Name').DoSetText('AUTOMATION');
    SeS('Generic_Presenter_Address').DoSetText('BACOOR CAVITE');
    SeS('Generic_Phone_Number').DoSetText(MobileNo);
    SeS('Generic_ID_Presented').DoSetText('SSS-ID');
    Global._DoSendKeys('{ENTER}');
    SeS('Generic_Next').DoClick();
}

function enterIRFRequestedBy() {
    SeS('Generic_Add').DoClick();
    SeS('Generic_Next').DoClick();
}

function enterIRFUserInput(titleType) {
    Global._DoWaitFor('Title_Type', 5000, 2000);
    SeS('Title_Type').DoSetText(titleType);
    Global._DoWaitFor('Generic_List', 5000, 2000);
    SeS('Generic_List').DoClick();
    SeS('Title_Number').DoSetText('AUT-203'); //<-Temporary Title
    SeS('Number_Of_Copies').DoSetText('1');
    SeS('Generic_Add').DoClick();
    SeS('Generic_Next').DoClick();
}

function enterIRFVerification() {
    SeS('Email_One').DoSetText(email);
    SeS('Preview').DoClick();
    SeS('Generic_Submit').DoClick();

    Global._DoWaitFor('CLRP_Notification', 5000, 2000);
    SeS('CLRP_Notification').DoClick();

    //Open PDF
    var src = SeS('CLRP_PDF_Viewer').DoDOMGetAttribute('src');
    Navigator.DoCreateWindow(src);
    Navigator.Maximize();

    //	//Menu
    //	Global._DoWaitFor('PDFViewer_Menu',5000,2000);
    //	SeS('PDFViewer_Menu').DoClick();
    //	
    //	//Zoom In
    //	Global._DoWaitFor('PDFViewer_Zoom',5000,2000);
    //	SeS('PDFViewer_Zoom').DoSetText('150%');
    //	Tester.CaptureDesktopImage('CLRP BARCODE - ZOOM IN');
    //	
    //	//Zoom Out
    //	Global._DoWaitFor('PDFViewer_Zoom',5000,2000);
    //	SeS('PDFViewer_Zoom').DoSetText('90%');
    //	Tester.CaptureDesktopImage('CLRP BARCODE - ZOOM OUT');
    Navigator.DoCloseWindow();

    //Close PDF
    Global._DoWaitFor('CLRP_PDF_Close', 5000, 2000);
    SeS('CLRP_PDF_Close').DoClick();
    SeS('CLRP_Notification_Front').DoClick();
    SeS('CLRP_Notification').DoClick();
}

function enterIRFVerificationNoPDF() {
    SeS('Email_One').DoSetText(email);
    SeS('Preview').DoClick();
    SeS('Generic_Submit').DoClick();
}

function createRafTransactionEntry(major, minor, currValue, consValue) {

    Global._DoWaitFor('Transaction_Details_Grid_Major_Transaction', 5000, 600);
    SeS('Transaction_Details_Grid_Major_Transaction').DoSetText(major);
    Global.DoSleep(1000);
    SeS('Generic_List').DoClick();
    SeS('Transaction_Details_Grid_Minor_Transaction').DoSetText(minor);
    Global.DoSleep(1000);
    SeS('Generic_List').DoClick();


    if (Global.DoWaitFor('Generic_CurrentAssessed_Value', 3000)) {
        SeS('Generic_CurrentAssessed_Value').DoClick();
        SeS('Generic_CurrentAssessed_Value').DoSetText(currValue);

    }

    if (Global.DoWaitFor('Generic_Consideration_Value', 3000)) {
        SeS('Generic_Consideration_Value').DoClick();
        SeS('Generic_Consideration_Value').DoSetText(consValue);
    }

    SeS('Generic_Next').DoClick();
}

function eTDUploadSubmitDownloadPDF() {
    SeS('ETD_Submit_Submit').DoClick();
    SeS('ETD_Alert_Yes').DoClick();
    SeS('ETD_Alert_OK').DoClick();

    Global.DoSleep(5000);
    Tester.CaptureDesktopImage('Print Preview Transaction');

    while (count < 3)
    Global.DoSendKeys('{ENTER}');

    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Successfully Downloaded PDF');
    SeS('ViewTrans_View_Preview_Close').DoClick();
    SeS('ETD_Submit_Notif').DoClick();
    SeS('ETD_Upload_Success').DoClick();
}

function GetBlkAndLotDataFromXMLFile() {
    var fso, textfile;
    var data = new Array([5]);
    var i = 0;

    fso = new ActiveXObject("Scripting.FileSystemObject");
    text_file = fso.OpenTextFile("C:\\Users\\Public\\CLRP\\XML File\\PSD-9090_BA_L2_2.xml");

    while (!text_file.AtEndOfStream) {
        data[i] = text_file.ReadLine();
        i++;
    }

    getLot = data[4];
    getBlock = data[5];

    var str0 = getLot;
    var str1 = getBlock;

    var Lot = str0.replace(/\D/g, "");
    var Block = str1.replace(/\D/g, "");
}

function updateViewTransaction() {
    SeS('CLRP_View_Transaction').DoClick();
    SeS('ViewTrans_Update').DoClick();
}

function enterDARDocumentSubmit() {
    SeS('Document_Submit').DoClick();
    enterRemarks();
    SeS('Alert_Yes').DoClick();
}

function clrpAdminLogin(userType) {
    clrpCredentials(userType);
    SeS('CLRP_Main_Login').DoClick();
    SeS('Login_Username').DoSetText(username);
    SeS('Login_Password').DoSetText(password);
    SeS('Login_Button').DoClick();
    Global._DoWaitFor('Label_View_Transactions', 5000, 500);

    //Validation
    if (Navigator.CheckObjectExists("Dashboard")) {
        Global.DoSleep(500);
        Tester.Assert('Successfully Login', true);
        Tester.CaptureDesktopImage('CLRP Admin Login');
    } else {
        Tester.CaptureDesktopImage('CLRP Admin Login');
        Tester.FailTest('Failed to Login CLRP');
    };
}

function enterRAFTransaction(major, minor) {
    //Added by: Carlo - 04.27.23
    Global._DoWaitFor('Major_Transaction_Text', 5000, 600);
    SeS('Major_Transaction_Text').DoSetText(major);
    Global.DoSleep(1000);
    SeS('Generic_List').DoClick();
    SeS('Minor_Transaction_Text').DoSetText(minor);
    Global.DoSleep(1000);
    SeS('Generic_List').DoClick();
    SeS('Generic_Next').DoClick();
}

function enterGenericSubmit() {
    //Added by: Carlo - 04.27.23
    SeS('Generic_Submit').DoClick();
    //PDF Print Transaction Screen Preview
    Global.DoSleep(3000);
    Tester.CaptureDesktopImage('Paalala Prompt');
    Global.DoSendKeys('{ESC}');
    Global.DoSleep(1000);
    Tester.CaptureDesktopImage('Print Transaction Screen');
    Global.DoSendKeys('{ESC}');
    Global.DoSleep(3000);
    Global.DoSendKeys('{ESC}');
    Global.DoSleep(3000);
    Global.DoSendKeys('{ESC}');
}

function closeBrowser() {
    //Added by: Carlo - 04.27.23
    Navigator.Close();
}

function uploadXMLFileWithCustomXML(xmlFile) {
    //Added by: Jefferson Andilab
    //Updated By: Alwin 09/12/23
    /*Example = xmlFile: PSD-9090_BA_L2_2*/

    SeS('ETD_Submit_Upload_eTD_Upload').DoSendKeys('C:\\Users\\Public\\CLRP\\XML File\\' + xmlFile + '.xml');

    if (Global.DoWaitFor('ETD_Alert_OK', 10000, 1000)) {
        Tester.CaptureDesktopImage('Error Message');
        SeS('ETD_Alert_OK').DoClick();
    }

}

function uploadCustomXML(xmlFile) {

    //Createdd By: Alwin 09/12/23
    /*Example = xmlFile: PSD-9090_BA_L2_2*/

    SeS('ETD_Submit_Upload_eTD_Upload').DoSendKeys('C:\\Users\\Public\\CLRP\\XML File\\' + xmlFile + '.xml');
}
//SeSOnTestFailed (function (stat
//    Global.DoSleep()us) { 
//	Tester.CaptureDesktopImage('Failed');
//	Global.DoSleep(1000);
//	WebDriver.Quit();
//});

//SeSOnTestFinish (function() {
//
//Global.DoSleep(5000);
//WebDriver.Quit();
//
//});

SeSOnTestInit(function() {
    g_saveScreenshotOnFailure = true;
});

//SeSOnTestFailed(function(status) {
//	Global.DoSleep(3000);
//	Log('Test Failed');
//	Log(status);
//	WebDriver.Close();
//});

function enterPresenterRAF(){
    //Created by Jerico 05/29/24
    /*Updated By: Almer 06/03/2024*/
	/*Updated By: Almer 06/04/2024*/
    presenterName = getDataFromSpreadsheet('Presenter Name', 'RAF Presenter');
    presenterAddress = getDataFromSpreadsheet('Presenter Address','RAF Presenter');
    phoneNumber = getDataFromSpreadsheet('Phone Number','RAF Presenter');
    idPresented = getDataFromSpreadsheet('ID Presented','RAF Presenter');
    
    SeS('Generic_Presenter_Tab').DoClick();
    SeS('Generic_Presenter_Name').DoSetText(presenterName);
	    length = Navigator.DOMFindByXPath('(//input[@maxlength="250"])[1]').DoDOMGetAttribute('maxlength');
		Tester.AssertEqual('Name of Presenter = 250 maxlength', length, 250)
		
    SeS('Generic_Presenter_Address').DoSetText(presenterAddress);
	    length = Navigator.DOMFindByXPath('(//input[@maxlength="250"])[2]').DoDOMGetAttribute('maxlength');
		Tester.AssertEqual('Address = 250 maxlength', length, 250)
		
    SeS('Generic_Phone_Number').DoSetText(phoneNumber);
    	length = Navigator.DOMFindByXPath('(//input[@maxlength="25"])[1]').DoDOMGetAttribute('maxlength');
		Tester.AssertEqual('Phone Number = 25 maxlength', length, 25)
		
    SeS('Generic_ID_Presented').DoSetText(idPresented);
	    length = Navigator.DOMFindByXPath('(//input[@maxlength="250"])[3]').DoDOMGetAttribute('maxlength');
		Tester.AssertEqual('ID Presented = 250 maxlength', length, 250)
    Global._DoSendKeys('{ENTER}');
    SeS('Generic_Next').DoClick();
}

function enterInfavorOfRAF(){
    //Updated by Jerico 05.29.24
	/*Updated By: Almer 06/04/2024*/

    inFavorName = getDataFromSpreadsheet('In Favor Name', 'RAF In Favor Of');
    SeS('Generic_In_FavorOf_Tab').DoClick();
    SeS('InFavor_Of_Textfield').DoSetText(inFavorName);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="500"])[1]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('In favor Of = 500 maxlength', length, 500)
    SeS('Generic_Add').DoClick();
    SeS('Generic_Next').DoClick();
}

function enterRAFDocumentNotarial() {
    // Created by Jerico 05/29/24
    documentNumber = getDataFromSpreadsheet('Document Number', 'RAF Document Notarial');
    pageNumber = getDataFromSpreadsheet('Page Number', 'RAF Document Notarial');
    bookNumber = getDataFromSpreadsheet('Book Number', 'RAF Document Notarial');
    seriesOf = getDataFromSpreadsheet('Series Of', 'RAF Document Notarial');
    nameofnotaryPublic = getDataFromSpreadsheet('Name Of Notary Public', 'RAF Document Notarial');
    notaryDate = getDataFromSpreadsheet('Notary Date', 'RAF Document Notarial');
    placeofNotary = getDataFromSpreadsheet('Place of Notary', 'RAF Document Notarial');

    SeS('RL_Document_Notarial_Tab').DoClick();
    SeS('Document_Number').DoSetText(documentNumber);
    SeS('Page_Number').DoSetText(pageNumber);
    SeS('Book_Number').DoSetText(bookNumber);
    SeS('Series_Of').DoSetText(seriesOf);
    SeS('Name_Of_Notary_Public').DoSetText(nameofnotaryPublic);
    SeS('Notary_Date').DoSetText(notaryDate);
    SeS('Place_Of_Notary').DoSetText(placeofNotary);
}

function enterPresenterIRF() {
    //Created by Jerico - 05/29/24
    presenterName = getDataFromSpreadsheet('Presenter Name', 'IRF Presenter');
    presenterAddress = getDataFromSpreadsheet('Presenter Address', 'IRF Presenter');
    phoneNumber = getDataFromSpreadsheet('Phone Number', 'IRF Presenter');
    idPresented = getDataFromSpreadsheet('ID Presented', 'IRF Presenter');

    SeS('Generic_Presenter_Name').DoSetText(presenterName);
    SeS('Generic_Presenter_Address').DoSetText(presenterAddress);
    SeS('Generic_Phone_Number').DoSetText(phoneNumber);
    SeS('Generic_ID_Presented').DoSetText(idPresented);
    Global._DoSendKeys('{ENTER}');
    SeS('Generic_Next').DoClick();
}


function enterTransactionIRF() {
    //Created by Jerico - 05/29/24
    minor = getDataFromSpreadsheet('Minor', 'IRF Transaction');
    currValue = getDataFromSpreadsheet('Current Assessed Value', 'IRF Transaction');
    consValue = getDataFromSpreadsheet('Consideration Value    ', 'IRF Transaction');

    Global._DoWaitFor('Minor_Transaction_Text', 5000, 2000);
    SeS('Minor_Transaction_Text').DoSendKeys(minor);
    Global._DoWaitFor('Generic_List', 5000, 3000);
    SeS('Generic_List')._DoClick();

    if (Global.DoWaitFor('Generic_CurrentAssessed_Value', 3000)) {
        SeS('Generic_CurrentAssessed_Value').DoClick();
        SeS('Generic_CurrentAssessed_Value').DoSetText(currValue);

    }

    if (Global.DoWaitFor('Generic_Consideration_Value', 3000)) {
        SeS('Generic_Consideration_Value').DoClick();
        SeS('Generic_Consideration_Value').DoSetText(consValue);
    }

    SeS('Generic_Next').DoClick();
}

function enterPresenterIRF() {
    presenterName = getDataFromSpreadsheet('Presenter Name', 'IRF Presenter');
    presenterAddress = getDataFromSpreadsheet('Presenter Address', 'IRF Presenter');
    phoneNumber = getDataFromSpreadsheet('Phone Number', 'IRF Presenter');
    idPresented = getDataFromSpreadsheet('ID Presented', 'IRF Presenter');


    SeS('Generic_Presenter_Name').DoSetText('AUTOMATION');
    SeS('Generic_Presenter_Address').DoSetText('BACOOR CAVITE');
    SeS('Generic_Phone_Number').DoSetText(MobileNo);
    SeS('Generic_ID_Presented').DoSetText('SSS-ID');
    Global._DoSendKeys('{ENTER}');
    SeS('Generic_Next').DoClick();
}

function createTransactionEntryRAF() {

    major = getDataFromSpreadsheet('Major Transaction', 'RAF Transaction Entry');
    minor = getDataFromSpreadsheet('Minor Transaction', 'RAF Transaction Entry');
    currValue = getDataFromSpreadsheet('Current Assessed Value', 'RAF Transaction Entry');
    consValue = getDataFromSpreadsheet('Consideration Value    ', 'RAF Transaction Entry');

    Global._DoWaitFor('Transaction_Details_Grid_Major_Transaction', 5000, 600);
    SeS('Transaction_Details_Grid_Major_Transaction').DoSetText(major);
    Global.DoSleep(1000);
    SeS('Generic_List').DoClick();
    SeS('Transaction_Details_Grid_Minor_Transaction').DoSetText(minor);
    Global.DoSleep(1000);
    SeS('Generic_List').DoClick();


    if (Global.DoWaitFor('Generic_CurrentAssessed_Value', 3000)) {
        SeS('Generic_CurrentAssessed_Value').DoClick();
        SeS('Generic_CurrentAssessed_Value').DoSetText(currValue);

    }

    if (Global.DoWaitFor('Generic_Consideration_Value', 3000)) {
        SeS('Generic_Consideration_Value').DoClick();
        SeS('Generic_Consideration_Value').DoSetText(consValue);
    }

    SeS('Generic_Next').DoClick();
}

function enterTitleReferenceRAF() {

    titleType = getDataFromSpreadsheet('Title Type', 'RAF Title Reference');
    titleNumber = getDataFromSpreadsheet('Title Number', 'RAF Title Reference');

    SeS('RL_Title_Reference_Tab').DoClick();
    SeS('Title_Type').DoSetText(titleType);
    SeS('Generic_List').DoClick();
    SeS('Title_Number').DoSetText(titleNumber);
    SeS('Generic_Add').DoClick();
}

function enterUploadETD() {
    var registryofDeeds = getDataFromSpreadsheet('Registry of Deeds', 'ETD Upload');
    var submitplanNumber = getDataFromSpreadsheet('Plan Number', 'ETD Upload');
    var submitnoParcels = getDataFromSpreadsheet('Number of Parcels', 'ETD Upload');

    SeS('ETD_Submit_RegistryOfDeeds').DoClick();
    Global.DoSendKeys(registryofDeeds);
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Submit_PlanNumber').DoSetText(submitplanNumber);
    SeS('ETD_Submit_No.Parcels').DoSetText(submitnoParcels);
}


function enterExecutedByRAF(){ 
/*Added By Almer: 5/30/24*/
/*Updated By: Almer 06/04/2024*/

    executedby = getDataFromSpreadsheet('Executed By','RAF Presenter');
	SeS('Generic_Executed_By_Tab').DoClick();
	SeS('Generic_Executed_By').DoSetText(executedby);
	length = Navigator.DOMFindByXPath('(//input[@maxlength="500"])[1]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Executed By = 500 maxlength', length, 500)
	SeS('Generic_Add').DoClick();
	//Updated by Carlo 04.27.23
	SeS('Generic_Next').DoClick();
}


function enterRAFDocumentNotarialwithNotaryDateinputted(){
/*Added By Almer: 5/31/24*/
/*Updated By: Almer 06/04/2024*/

	documentNumber = getDataFromSpreadsheet('Document Number', 'RAF Document Notarial');
    pageNumber = getDataFromSpreadsheet('Page Number', 'RAF Document Notarial');
    bookNumber = getDataFromSpreadsheet('Book Number', 'RAF Document Notarial');
    seriesOf = getDataFromSpreadsheet('Series Of', 'RAF Document Notarial');
    nameofnotaryPublic = getDataFromSpreadsheet('Name Of Notary Public', 'RAF Document Notarial');
    notaryDate = getDataFromSpreadsheet('Notary Date', 'RAF Document Notarial');
    placeofNotary = getDataFromSpreadsheet('Place Of Notary', 'RAF Document Notarial');
    
    SeS('RL_Document_Notarial_Tab').DoClick();
    SeS('Document_Number').DoSetText(documentNumber);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="15"])[1]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Document No. = 15 maxlength', length, 15)
    SeS('Page_Number').DoSetText(pageNumber);
	length = Navigator.DOMFindByXPath('(//input[@maxlength="15"])[2]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Page No. = 15 maxlength', length, 15)
    SeS('Book_Number').DoSetText(bookNumber);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="15"])[3]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Book No. = 15 maxlength', length, 15)
    SeS('Series_Of').DoSetText(seriesOf);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="15"])[4]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Series Of = 15 maxlength', length, 15)
    SeS('Name_Of_Notary_Public').DoSetText(nameofnotaryPublic);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="300"])[1]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Name Of Notary Public = 300 maxlength', length, 300)
	SeS('Notary_Date').DoSetText(notaryDate);
	
    SeS('Notary_Date_2').DoSetText(notaryDate);
    
    SeS('Notary_Date_3').DoSetText(notaryDate);
    
    SeS('Notary_Date_4').DoSetText(notaryDate);
    
    SeS('Place_Of_Notary').DoSetText(placeofNotary);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="300"])[1]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Place Of Notary = 300 maxlength', length, 300)
 }
 
function enterRAFConsularDocumentNotarialwithNotaryDateinputted(){
/*Added By Almer: 5/31/24*/
/*Updated By: Almer 06/04/2024*/
	documentNumber = getDataFromSpreadsheet('Document Number', 'RAF Document Notarial');
    serviceno = getDataFromSpreadsheet('Service No', 'RAF Document Notarial');
    pageNumber = getDataFromSpreadsheet('Page Number', 'RAF Document Notarial');
    bookNumber = getDataFromSpreadsheet('Book Number', 'RAF Document Notarial');
    seriesOf = getDataFromSpreadsheet('Series Of', 'RAF Document Notarial');
    nameofnotaryPublic = getDataFromSpreadsheet('Name Of Notary Public', 'RAF Document Notarial');
    notaryDate = getDataFromSpreadsheet('Notary Date', 'RAF Document Notarial');
    placeofNotary = getDataFromSpreadsheet('Place of Notary', 'RAF Document Notarial');
    consulgeneral = getDataFromSpreadsheet('Consul General', 'RAF Document Notarial');
    consularoffice = getDataFromSpreadsheet('Consular Office', 'RAF Document Notarial');
    consularaddress = getDataFromSpreadsheet('Consular Address', 'RAF Document Notarial');

    SeS('Consular_Notarial_Details_Checkbox').DoClick();
    SeS('Consular_Notarial_Details_Document_No').DoSetText(documentNumber);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="15"])[5]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Document No. = 15 maxlength', length, 15)
    SeS('Consular_Notarial_Details_Service_No').DoSetText(serviceno);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="15"])[6]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Service No. = 15 maxlength', length, 15)
   	SeS('Consular_Notarial_Details_Book_No').DoSetText(bookNumber);
   	length = Navigator.DOMFindByXPath('(//input[@maxlength="15"])[7]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Book No. = 15 maxlength', length, 15)
    SeS('Consular_Notarial_Details_Series_Of').DoSetText(seriesOf);
   	length = Navigator.DOMFindByXPath('(//input[@maxlength="15"])[8]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Series Of = 15 maxlength', length, 15)

    SeS('Consular_Notarial_Details_Consul_General').DoSetText(consulgeneral);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="200"])[1]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Consul General = 200 maxlength', length, 200)


    
    SeS('Consular_Notarial_Details_Consular_Office').DoSetText(consularoffice);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="300"])[3]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Consular Office = 300 maxlength', length, 300)

    
    SeS('Consular_Notarial_Details_Consular_Address').DoSetText(consularaddress);
    length = Navigator.DOMFindByXPath('(//input[@maxlength="300"])[4]').DoDOMGetAttribute('maxlength');
	Tester.AssertEqual('Consular Address = 300 maxlength', length, 300)

    
    SeS('Consular_Notarial_Details_Consular_Consular_Notary_Date').DoSetText(notaryDate);
    SeS('Consular_Notarial_Details_Consular_Consular_Notary_Date_2').DoSetText(notaryDate);
    SeS('Consular_Notarial_Details_Consular_Consular_Notary_Date_3').DoSetText(notaryDate);
    SeS('Consular_Notarial_Details_Consular_Consular_Notary_Date_4').DoSetText(notaryDate);
      
}

function enterTitleReferenceRAF() {
    /*Added By Almer: 5/31/24*/

    titleType = getDataFromSpreadsheet('Title Type', 'RAF Title Reference');
    TitleNo = getDataFromSpreadsheet('Title Number', 'RAF Title Reference');

    SeS('RL_Title_Reference_Tab').DoClick();
    SeS('Title_Type').DoSetText(titleType);
    SeS('Generic_List').DoClick();
    SeS('Title_Number').DoSetText(TitleNo);
    SeS('Generic_Add').DoClick();
    SeS('Generic_Next').DoClick();
}

function enterPlanInformationEncodeTitlePolygonETD() {
    var addCorners = getDataFromSpreadsheet('Add Corners', 'ETD Title Polygon');
    var northSouth0 = getDataFromSpreadsheet('North South 0', 'ETD Title Polygon');
    var distance0 = getDataFromSpreadsheet('Distance 0', 'ETD Title Polygon');
    var northSouth1 = getDataFromSpreadsheet('North South 1', 'ETD Title Polygon');
    var distance1 = getDataFromSpreadsheet('Distance 1', 'ETD Title Polygon');
    var northSouth2 = getDataFromSpreadsheet('North South 2', 'ETD Title Polygon');
    var distance2 = getDataFromSpreadsheet('Distance 2', 'ETD Title Polygon');
    var northSouth3 = getDataFromSpreadsheet('North South 3', 'ETD Title Polygon');
    var distance3 = getDataFromSpreadsheet('Distance 3', 'ETD Title Polygon');
    var northSouth4 = getDataFromSpreadsheet('North South 4', 'ETD Title Polygon');
    var distance4 = getDataFromSpreadsheet('Distance 4', 'ETD Title Polygon');

    SeS('ETD_Add_Corners').DoSetText('4');
    SeS('ETD_Add').DoClick();
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

function enterETDPlanInformationEncode() {
    /*Update By: Almer 6/3/24*/
    var blockNo = getDataFromSpreadsheet('Block No', 'ETD Plan Information');
    var lotNo = getDataFromSpreadsheet('Lot No', 'ETD Plan Information');
    var portionOf = getDataFromSpreadsheet('Portion Of', 'ETD Plan Information');
    var location = getDataFromSpreadsheet('Location', 'ETD Plan Information');
    var area = getDataFromSpreadsheet('Area', 'ETD Plan Information');
    var descriptionOfCorners = getDataFromSpreadsheet('Description Of Corners', 'ETD Plan Information');
    var surveySystem = getDataFromSpreadsheet('Survey System', 'ETD Plan Information');
    var lrcRecordNo = getDataFromSpreadsheet('LRC/Record No', 'ETD Plan Information');
    var declination = getDataFromSpreadsheet('Registry of Deeds', 'ETD Plan Information');
    var dateofOriginalSurvey = getDataFromSpreadsheet('Date of Original Survey', 'ETD Plan Information');
    var dateofSurveyExecuted = getDataFromSpreadsheet('Date of Survey Executed', 'ETD Plan Information');
    var dateofSurveyApproved = getDataFromSpreadsheet('Date of Survey Approved', 'ETD Plan Information');
    var geogeticEngineer = getDataFromSpreadsheet('Geogetic Engineer', 'ETD Plan Information');
    var notes = getDataFromSpreadsheet('Notes', 'ETD Plan Information');
    var tiepoint = getDataFromSpreadsheet('Tie Point', 'ETD Plan Information');


    SeS('ETD_Block_No').DoSetText(blockNo);
    SeS('ETD_Lot_No').DoSetText(lotNo);
    SeS('ETD_Portion_of').DoSetText(portionOf);
    SeS('ETD_Tie_Point_ID').DoSetText(tiepoint);
    SeS('ETD_Location').DoSetText(location);
    SeS('ETD_Area').DoSetText(area);
    SeS('ETD_Unit_of_Measure').DoClick();
    Global.DoSendKeys('Square Meters');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Description_of_Corners').DoSetText(descriptionOfCorners);
    SeS('ETD_Survey_System').DoSetText(surveySystem);
    SeS('ETD_Bearing').DoClick();
    Global.DoSendKeys('True');
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_LRC/Records_No').DoSetText(lrcRecordNo);
    SeS('ETD_Declination').DoSetText(declination);
    SeS('ETD_DateOf_Orginal_Survey').DoSetText(dateofOriginalSurvey);
    SeS('ETD_DateOf_Survey_Executed').DoSetText(dateofSurveyExecuted);
    SeS('ETD_DateOf_Survey_Approved').DoSetText(dateofSurveyApproved);
    SeS('ETD_Geodetic_Engineer').DoSetText(geogeticEngineer);
    SeS('ETD_Notes').DoSetText(notes);
}


function enterTitleReferenceRAFwCharacterValidation(length){
/*Added By Almer: 6/4/24*/
/*ex:enterTitleReferenceRAFwCharacterValidation('14')*/
    titleType = getDataFromSpreadsheet('Title Type', 'RAF Title Reference');
	TitleNo = getDataFromSpreadsheet('Title Number', 'RAF Title Reference');

	SeS('RL_Title_Reference_Tab').DoClick();
	SeS('Title_Type').DoSetText(titleType);
	SeS('Generic_List').DoClick();
	SeS('Title_Number').DoSetText(TitleNo);
	var text = Navigator.DOMFindByXPath("//div[contains(text(),'Title No.')]/../following-sibling::div//input").GetValue();
	count = text.length;
	Tester.AssertEqual('Validate if length Accept '+length+' Characters', count, length);
	SeS('Generic_Add').DoClick();
	SeS('Generic_Next').DoClick();
}	


function enterUploadETDwCharacterValidation(registryofDeeds,submitplanNumber,submitnoParcels,length) {
/*Almer 6/4/2024*/
    var registryofDeeds = getDataFromSpreadsheet('Registry of Deeds', 'ETD Upload');
    var submitplanNumber = getDataFromSpreadsheet('Plan Number', 'ETD Upload');
    var submitnoParcels = getDataFromSpreadsheet('Number of Parcels', 'ETD Upload');
    SeS('ETD_Submit_RegistryOfDeeds').DoClick();
    Global.DoSendKeys(registryofDeeds);
    Global.DoSleep(1000);
    Global.DoSendKeys('{ENTER}');
    Global.DoSendKeys('{ENTER}');
    SeS('ETD_Submit_No.Parcels').DoSetText(submitnoParcels);
    SeS('ETD_Submit_PlanNumber').DoSetText(submitplanNumber);
  	var text = Navigator.DOMFindByXPath("//div[8]/div[2]/div[3]/div/input[@type='text']").GetValue();
	count = text.length;
	Tester.AssertEqual('Validate if length Accept '+length+' Characters', count, length);
}


function getRowIdByTCID(TCID) {
    // Attach to the spreadsheet located in the %WORKDIR% directory
    var success = Spreadsheet.DoAttach('%WORKDIR%/Data.xlsx', 'PDF Download Details');
    Tester.Assert('Open Spreadsheet', success);

    // Initialize row ID to -1 (indicating TCID not found)
    var rowId = -1;

    // Loop through the spreadsheet rows sequentially
    while (Spreadsheet.DoSequential()) {
        // Check if the first column (0-index) matches the provided TCID
        if (Spreadsheet.GetCell(0) == TCID) {
            // Get the current row ID
            rowId = Spreadsheet.GetCurrentRowIndex();
            break; // Exit the loop once TCID is found
        }
    }

    return rowId;
}

function setDataSpreadsheet(value, columnId) {
    // Attach to the spreadsheet located in the %WORKDIR% directory
    var success = Spreadsheet.DoAttach('%WORKDIR%/Data.xlsx', 'PDF Download Details');
    Tester.Assert('Open Spreadsheet', success);

    // Get the current TCID
    var TCID = Tester.GetTestName();
    
    // Get the row ID for the TCID
    var rowId = getRowIdByTCID(TCID);

    if (rowId != -1) {
        // Set the value in the specified cell using column ID and found row ID
        
        Spreadsheet.SetCell(value, columnId, rowId);
        // Save the spreadsheet after modification
        Spreadsheet.DoSave();
        // Output the action to the Tester log
        Tester.Message('Set value: ' + value + ' in column: ' + columnId + ', row: ' + rowId + ', for TCID: ' + TCID);
    } else {
        // If TCID is not found, log an error message
        Tester.Message('Error: TCID ' + TCID + ' not found in the spreadsheet.');
    }
}

function downloadETDApplicationForm() {
    var prefix = "ETD Application Form";
    var index = 8;

    Global.DoSendKeys('^j');
    Global.DoSendKeys('^w');
    // Download the file
    for (var i = 0; i < index; i++) {
        Global.DoSendKeys('{TAB}');
    }
    Global.DoSendKeys('{ENTER}');

    // Get the current date and time
    var dt = new Date();
    var year = dt.getFullYear();
    var month = (dt.getMonth() + 1 < 10 ? '0' : '') + (dt.getMonth() + 1);
    var day = (dt.getDate() < 10 ? '0' : '') + dt.getDate();
    var hours = (dt.getHours() < 10 ? '0' : '') + dt.getHours();
    var minutes = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes();
    var seconds = (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds();

    var formattedDateTime = year + '-' + month + '-' + day + '_' + hours + '_' + minutes + '_' + seconds;
   	Global.DoSleep(5000);

    // Specify the file name with the given prefix
    var fileName = prefix + "-" + formattedDateTime + ".pdf";
    Global.DoSendKeys(fileName);
    Global.DoSendKeys('{ENTER}');
    Global.DoSleep(10000);  // Increased sleep to ensure download completion

    var TCID = Tester.GetTestName();
    Tester.Message("Test Case ID: " + TCID);

    // Define source and destination
    var shell = new ActiveXObject("WScript.Shell");
    var userProfile = shell.ExpandEnvironmentStrings("%USERPROFILE%");
    var sourceFolder = userProfile + "\\Downloads\\";
    var dateToday = year + '-' + month + '-' + day;
    var sourceFile = sourceFolder + fileName;
    var destinationFolder = "C:\\Users\\Public\\CLRP\\Reports\\" + dateToday + "\\" + TCID + "\\";
    var destinationFile = destinationFolder + fileName;

    var fso = new ActiveXObject("Scripting.FileSystemObject");

    // Verify if the source file exists before moving
    if (fso.FileExists(sourceFile)) {
        Tester.Message("Source file exists: " + sourceFile);

        // Specify the path for the batch file
        var batchFileName = "moveFiles.bat";
        var batchFilePath = "C:\\Users\\Public\\CLRP\\" + batchFileName;

        // Open the batch file for writing
        var textfile = fso.OpenTextFile(batchFilePath, 2, true);

        // Write the commands to the batch file
        textfile.WriteLine("@echo off");
        textfile.WriteLine("if not exist \"" + destinationFolder + "\" mkdir \"" + destinationFolder + "\"");
        textfile.WriteLine("set \"source=" + sourceFile + "\"");
        textfile.WriteLine("set \"destination=" + destinationFile + "\"");
        textfile.WriteLine("move \"%source%\" \"%destination%\"");

        // Close the batch file
        textfile.Close();
		Global.DoSleep(2000); 
        // Launch the batch file
        Global.DoLaunch(batchFilePath);
        Global.DoSleep(10000);  // Increased sleep to ensure the move operation completes

        // Check if the destination file exists after moving
        if (fso.FileExists(destinationFile)) {
            Tester.Message("File moved successfully to: " + destinationFile);

            // Set Data in Spreadsheet
            setDataSpreadsheet(fileName, "File Name");
            setDataSpreadsheet(destinationFile, "Location");

            // Get the path of the PDF and extract the Transaction number
            Tester.Message("Destination file: " + destinationFile);

            var fullPath = destinationFile;
            Tester.Message("Full Path: " + fullPath);

            var text = PDF2_GetFullText(fullPath);
            if (text) {
                Tester.Message("PDF Text: " + text);

                // Extract the CLRP Reference Number
                var clrpReferenceNumber = extractCLRPReferenceNumberETD(text);

                // Log the result 
                if (clrpReferenceNumber) {
                    Tester.Message("CLRP Reference Number: " + clrpReferenceNumber);
                } else {
                    Tester.Message("CLRP Reference Number not found.");
                }

                // Set the CLRP Reference number in Spreadsheet
                setDataSpreadsheet(clrpReferenceNumber, "CLRP Reference Number");
            } else {
                Tester.Message("Failed to extract text from PDF.");
            }
        } else {
            Tester.Message("Error: File does not exist after moving - " + destinationFile);
        }
    } else {
        Tester.Message("Error: Source file does not exist - " + sourceFile);
        
        // List all files in the Downloads folder for debugging
        var files = [];
        var e = new Enumerator(fso.GetFolder(sourceFolder).Files);
        for (; !e.atEnd(); e.moveNext()) {
            var file = e.item();
            files.push({
                name: file.Name,
                created: file.DateCreated
            });
        }

        // Sort files by creation date descending
        files.sort(function(a, b) {
            return b.created - a.created;
        });

        // Log sorted files
        for (var i = 0; i < files.length; i++) {
            Tester.Message("File in Downloads folder: " + files[i].name + ", Created: " + files[i].created);
        }
    }
}


function extractCLRPReferenceNumberETD(text) {
    // Log the entire text content for debugging
    Tester.Message("PDF Text Content: " + text);

    // Try to match the CLRP Reference Number using a regex pattern
    var pattern = /CLRP Reference Number:\s*(CLRP_eTD-\d+)/;
    var match = text.match(pattern);
    
    // Log the extraction attempt
    if (match) {
        Tester.Message("CLRP Reference Number matched: " + match[1]);
        return match[1];
    } else {
        Tester.Message("CLRP Reference Number not found in text.");
        return null;
    }
}


function extractCLRPReferenceNumber(){

    // Get the path of the PDF and extract the Transaction number
    Tester.Message("Destination file: " + destinationFile);
    
    var fullPath = destinationFile;
	Tester.Message("Full Path: " + fullPath);
	
	var text = PDF2_GetFullText(fullPath);
	Tester.Message(text);
	
	// Extract the CLRP Reference Number
	var clrpReferenceNumber = extractCLRPReferenceNumberETD(text);
	
	// Log the result 
	if (clrpReferenceNumber) {
	    Tester.Message("CLRP Reference Number: " + clrpReferenceNumber);
	} else {
	    Tester.Message("CLRP Reference Number not found.");
	}
	
	// Set the CLRP Reference number in Spreadsheet
    setDataSpreadsheet(clrpReferenceNumber, "CLRP Reference Number");


}

function submitETD(){
	//Updated by: Alwin - 041923
	SeS('ETD_Submit_Submit').DoClick();
	SeS('ETD_Alert_Yes').DoClick();
	SeS('ETD_Alert_OK').DoClick();
	Global.DoSleep(5000);
	Global.DoSleep(3000);
	Tester.CaptureDesktopImage('Barcode and Reference');
	
	downloadETDApplicationForm();
	
	Global.DoSendKeys('{ESC}');
	Navigator.SeSFind("//div[@aria-label='close button']").DoClick();
	SeS('ETD_Submit_Notif').DoClick();
	SeS('ETD_Upload_Success').DoClick();
}