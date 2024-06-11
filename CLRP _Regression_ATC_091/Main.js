//Use 'Record/Learn' button to begin test recording

function Test(params)
{
	 navigateCLRPPage();
	 Navigator.SeSFind("//p[text()='Download CLRP Training Guides']").DoClick();
	 Tester.CaptureDesktopImage('Download CLRP Training Guides');
	 Navigator.SeSFind("//button[@ aria-label='Close']").DoClick();
	 
	 
	 
}

g_load_libraries=["Web"]

