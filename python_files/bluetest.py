import bluetooth,subprocess
import serial
import json
#add arduino's buetooth address
#bluetooth_addr=""
#nearby_devices = bluetooth.discover_devices(duration=4,lookup_names=True,flush_cache=True, lookup_class=False)
name = "HC-05"      # Device name
addr ='98:D3:37:00:9D:5C'# Device Address
port = 1       
passkey = "1234" # passkey of the device you want to connect

# kill any "bluetooth-agent" process that is already running
#subprocess.call("kill -9 `pidof bluetooth-agent`",shell=True)

# Start a new "bluetooth-agent" process where XXXX is the passkey
#status = subprocess.call("bluetooth-agent " + passkey + " &",shell=True)

#passkey = "1111" 
#codes for sending the data
#    1 light on
#    2 light off
#	 3 fan on
#	 4 fan off
prev={"l":0,"b":0}
false="false"
true="true"
s = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
s.connect((addr,port))
jsonI=raw_input()
tosend=""
jsonInput=json.loads(jsonI)
#print jsonInput
if jsonInput["switch1"]:
	tosend=tosend+'1'
elif not jsonInput["switch1"]:
	tosend=tosend+'0'
if jsonInput["switch2"]:
	tosend=tosend+'1'
elif not jsonInput["switch2"]:
	tosend=tosend+'0'
tosend='0b'+tosend
#print tosend

tosend=int(tosend,2)
s.send(str(tosend))
rec=s.recv(2)
if(rec=="PP"):
	print jsonI
else:
	if rec[0]=='0':
		jsonInput["switch1"]=False
	elif rec[0]=='1':
		jsonInput["switch1"]=True
	if rec[1]=='0':
		jsonInput["switch2"]=False
	elif rec[1]=='1':
		jsonInput["switch2"]=True
print json.dumps(jsonInput)
#except bluetooth.btcommon.BluetoothError as err:
#	print "error"
#	pass



	