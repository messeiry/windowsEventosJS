/*
APPLICATION NAME:       windowsEventosJS
DEVELOLPED BY:          MOHAMED ELMESSEIRY, m.messeiry@gmail.com
APP TRACKING AND URL:   https://github.com/messeiry/windowsEventosJS/

ABOUT THE APPLICATION: 

FEATURES:


USEFULL COMMANDS: 
wmic --user ./\administrator%Messeiry@2012 //10.10.10.9 "SELECT * from Win32_NTLogEvent Where Logfile = 'System' AND (TimeGenerated >= '01/23/2017 11:52:08' AND TimeGenerated <= '01/23/2017 11:52:10')" 
wmic --user ./\administrator%Messeiry@2012 //10.10.10.9 "Select * from Win32_Directory where Name = 'c:\\'" 
wmic -U wmiuser%wmipasswd //wmi-server.localnet "select caption, name, parentprocessid, processid from win32_process"
    CLASS: Win32_Process
    Caption|Handle|Name|ParentProcessId|ProcessId
    System Idle Process|0|System Idle Process|0|0
    System|4|System|0|4
    smss.exe|212|smss.exe|4|212
    csrss.exe|288|csrss.exe|280|288
    csrss.exe|340|csrss.exe|332|340
    wininit.exe|348|wininit.exe|280|348
    winlogon.exe|376|winlogon.exe|332|376
    services.exe|436|services.exe|348|436
    lsass.exe|444|lsass.exe|348|444
    lsm.exe|452|lsm.exe|348|452
    svchost.exe|548|svchost.exe|436|548
    svchost.exe|624|svchost.exe|436|624
    svchost.exe|712|svchost.exe|436|712
    svchost.exe|744|svchost.exe|436|744
    svchost.exe|792|svchost.exe|436|792
    svchost.exe|832|svchost.exe|436|832
    svchost.exe|876|svchost.exe|436|876
    svchost.exe|976|svchost.exe|436|976
    spoolsv.exe|256|spoolsv.exe|436|256
    svchost.exe|692|svchost.exe|436|692
wmic --user ./\administrator%Messeiry@2012 //10.10.10.9 "SELECT * FROM Win32_Processor"
CLASS: Win32_Processor
AddressWidth|Architecture|Availability|Caption|ConfigManagerErrorCode|ConfigManagerUserConfig|CpuStatus|CreationClassName|CurrentClockSpeed|CurrentVoltage|DataWidth|Description|DeviceID|ErrorCleared|ErrorDescription|ExtClock|Family|InstallDate|L2CacheSize|L2CacheSpeed|L3CacheSize|L3CacheSpeed|LastErrorCode|Level|LoadPercentage|Manufacturer|MaxClockSpeed|Name|NumberOfCores|NumberOfLogicalProcessors|OtherFamilyDescription|PNPDeviceID|PowerManagementCapabilities|PowerManagementSupported|ProcessorId|ProcessorType|Revision|Role|SecondLevelAddressTranslationExtensions|SocketDesignation|Status|StatusInfo|Stepping|SystemCreationClassName|SystemName|UniqueId|UpgradeMethod|Version|VirtualizationFirmwareEnabled|VMMonitorModeExtensions|VoltageCaps
64|9|3|Intel64 Family 6 Model 63 Stepping 2|0|False|1|Win32_Processor|2401|33|64|Intel64 Family 6 Model 63 Stepping 2|CPU0|False|(null)|0|2|(null)|0|0|0|0|0|6|25|GenuineIntel|2401|Intel(R) Xeon(R) CPU E5-2620 v3 @ 2.40GHz|1|1|(null)|(null)|NULL|False|0FABFBFF000306F2|3|16130|CPU|False|CPU socket #0|OK|3|(null)|Win32_ComputerSystem|DC|(null)|4||False|False|2


WMIC - ExecQuery Error codes
In the case that you are going to use WMIC (with help of ExecQuer on MS Windows site) it is any time really handy to have the possibility to test your query if it is wailed. In our case WMIC is providing error code in cause of failure.

Error Name  Errot dec.  Error hex.  Meaning
wbemErrAccessDenied 2147749891  (0x80041003)    Current user does not have the permission to view the result set.
wbemErrFailed   2147749889  (0x80041001)    Unspecified error.
wbemErrInvalidParameter 2147749896  (0x80041008)    Invalid parameter was specified.
wbemErrInvalidQuery 2147749911  (0x80041017)    Query syntax is not valid.
wbemErrInvalidQueryType 2147749912  (0x80041018)    Requested query language is not supported.
wbemErrOutOfMemory  2147749894  (0x80041006)    Not enough memory to complete the operation.


date formate reference : 
dddd, mmmm dS, yyyy, h:MM:ss TT
*/

var fs = require('fs');
var dateFormat = require('dateformat');
var WmiClient = require('wmi-client');

var confFile = fs.readFileSync("config.json");
var conf = JSON.parse(confFile);


get()

function get() {
    "use strict";
    for (var key in conf) {
        let ServerName = conf[key]["ServerName"].toString();
        let ServerIP = conf[key]["ServerIP"].toString();
        let ServerUser = conf[key]["ServerUser"].toString();
        let ServerPass = conf[key]["ServerPass"].toString();
        let FiltersWMI = conf[key]["FiltersWMI"].toString();

        console.log(ServerName, ServerIP, ServerUser, ServerPass, FiltersWMI);
        let last5MinDateTime    = dateFormat(new Date(new Date() - 5*60000), "mm/dd/yyyy h:MM:ss TT"); 
        let last5HoursDateTime  = dateFormat(new Date(new Date() - 24*60*60000), "mm/dd/yyyy h:MM:ss TT");
        let wmi = new WmiClient({
            username: ServerUser,
            password: ServerPass,
            host: ServerIP
        });

        if (FiltersWMI.includes("Win32_NTLogEvent")) {

            if (FiltersWMI.includes("Where") | (FiltersWMI.includes("where"))){
                FiltersWMI += " AND TimeGenerated >= '"+last5HoursDateTime+"'";
            } else {
                FiltersWMI += " Where TimeGenerated >= '"+last5HoursDateTime+"'";
            }
        } else {
            log("Only Windows Events Queries are supported right now, please wait for next version");
        }
        wmi.query(FiltersWMI, function (err, result) {
            console.log(result);
            console.log(last5MinDateTime);

        });


    }

}



 





// Sample Functions
// get SystemName 
function getSystemName() {
    var wmi = new WmiClient({
        username: 'administrator',
        password: 'Messeiry@2012',
        host: '10.10.10.9'
    });
    wmi.query('SELECT Caption,Version FROM Win32_OperatingSystem', function (err, result) {
        console.log(result);
        /*
        RESULT:
          [{
            Caption: 'Microsoft Windows Server 2008 R2 Enterprise',
            Version: '6.1.7601'
          }]
        */
    });
}

// get processors details, Availability & performance
function getProcessor() {
    var wmi = new WmiClient({
        username: 'administrator',
        password: 'Messeiry@2012',
        host: '10.10.10.9'
    });
    wmi.query("SELECT * FROM Win32_Processor", function (err, result) {
    console.log(result);
    /*
    messeiry@ubuntu:~/Desktop/NodeJSApps/wmi$ sudo nodejs windowsEventos.js
[ { AddressWidth: 64,
    Architecture: 9,
    Availability: 3,
    Caption: 'Intel64 Family 6 Model 63 Stepping 2',
    ConfigManagerErrorCode: 0,
    ConfigManagerUserConfig: false,
    CpuStatus: 1,
    CreationClassName: 'Win32_Processor',
    CurrentClockSpeed: 2401,
    CurrentVoltage: 33,
    DataWidth: 64,
    Description: 'Intel64 Family 6 Model 63 Stepping 2',
    DeviceID: 'CPU0',
    ErrorCleared: false,
    ErrorDescription: null,
    ExtClock: 0,
    Family: 2,
    InstallDate: null,
    L2CacheSize: 0,
    L2CacheSpeed: 0,
    L3CacheSize: 0,
    L3CacheSpeed: 0,
    LastErrorCode: 0,
    Level: 6,
    LoadPercentage: 1,
    Manufacturer: 'GenuineIntel',
    MaxClockSpeed: 2401,
    Name: 'Intel(R) Xeon(R) CPU E5-2620 v3 @ 2.40GHz',
    NumberOfCores: 1,
    NumberOfLogicalProcessors: 1,
    OtherFamilyDescription: null,
    PNPDeviceID: null,
    PowerManagementCapabilities: null,
    PowerManagementSupported: false,
    ProcessorId: '0FABFBFF000306F2',
    ProcessorType: 3,
    Revision: 16130,
    Role: 'CPU',
    SecondLevelAddressTranslationExtensions: false,
    SocketDesignation: 'CPU socket #0',
    Status: 'OK',
    StatusInfo: 3,
    Stepping: null,
    SystemCreationClassName: 'Win32_ComputerSystem',
    SystemName: 'DC',
    UniqueId: null,
    UpgradeMethod: 4,
    Version: null,
    VirtualizationFirmwareEnabled: false,
    VMMonitorModeExtensions: false,
    VoltageCaps: 2 } ]
[ { AddressWidth: 64,
    Architecture: 9,
    Availability: 3,
    Caption: 'Intel64 Family 6 Model 63 Stepping 2',
    ConfigManagerErrorCode: 0,
    ConfigManagerUserConfig: false,
    CpuStatus: 1,
    CreationClassName: 'Win32_Processor',
    CurrentClockSpeed: 2401,
    CurrentVoltage: 33,
    DataWidth: 64,
    Description: 'Intel64 Family 6 Model 63 Stepping 2',
    DeviceID: 'CPU0',
    ErrorCleared: false,
    ErrorDescription: null,
    ExtClock: 0,
    Family: 2,
    InstallDate: null,
    L2CacheSize: 0,
    L2CacheSpeed: 0,
    L3CacheSize: 0,
    L3CacheSpeed: 0,
    LastErrorCode: 0,
    Level: 6,
    LoadPercentage: 0,
    Manufacturer: 'GenuineIntel',
    MaxClockSpeed: 2401,
    Name: 'Intel(R) Xeon(R) CPU E5-2620 v3 @ 2.40GHz',
    NumberOfCores: 1,
    NumberOfLogicalProcessors: 1,
    OtherFamilyDescription: null,
    PNPDeviceID: null,
    PowerManagementCapabilities: null,
    PowerManagementSupported: false,
    ProcessorId: '0FABFBFF000306F2',
    ProcessorType: 3,
    Revision: 16130,
    Role: 'CPU',
    SecondLevelAddressTranslationExtensions: false,
    SocketDesignation: 'CPU socket #0',
    Status: 'OK',
    StatusInfo: 3,
    Stepping: null,
    SystemCreationClassName: 'Win32_ComputerSystem',
    SystemName: 'DC',
    UniqueId: null,
    UpgradeMethod: 4,
    Version: null,
    VirtualizationFirmwareEnabled: false,
    VMMonitorModeExtensions: false,
    VoltageCaps: 2 } ]

    */
});
}


function log(msg) {
    console.log(new Date().toLocaleString() + " : " + msg);
}

