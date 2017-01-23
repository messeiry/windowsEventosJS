# Download Zenoss Source 
wget http://downloads.sourceforge.net/project/zenoss/zenoss-2.5%20%28Latest%20Stable%29/zenoss-2.5.1/zenoss-2.5.1.tar.gz
# Extract the wmi directory 
tar zxvf zenoss-2.5.1.tar.gz
cd zenoss-2.5
tar zxvf 
cd 
# Install autoconf 
sudo aptitude install autoconf 
# Patch the GNUmakefile 
# add the line ZENHOME= ../.. 
# Build WMI 
make 
#Get a cup of coffee. 
#Copy Files 
cp bin/* /usr/local/bin/ 
cp lib/python/* /usr/local/lib/python 
#Execute wmic 
wmic --user DOMIAN/\username%password //hostname "Select Name from Win32_Service" 
