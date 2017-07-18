#include <SoftwareSerial.h>
const int rxpin =2;
const int txpin =3;
char k='A';
char prev='b';

SoftwareSerial bluetooth(rxpin,txpin);
int light=10;
int fan=8;
void setup() {
  // put your setup code here, to run once:
  pinMode(light,OUTPUT);
  pinMode(fan,OUTPUT);
  pinMode(bl,OUTPUT);
  Serial.begin(9600);
  bluetooth.begin(9600);
  //bluetooth.println("Ready");
  //digitalWrite(bl,HIGH);
}

void loop() {
  // put your main code here, to run repeatedly:
  if(bluetooth.available()){
      k=bluetooth.read();
      //Serial.println(k);
    }
    if(k!=prev)
    {
    if(k=='0')
    {
      digitalWrite(light,LOW);
      digitalWrite(fan,LOW);   
      //Serial.println("fan 0");
      //Serial.println("light 0");
      prev=k;
      bluetooth.println("0");
    }
    else if(k=='1')
    {
      digitalWrite(fan,HIGH);
      digitalWrite(light,LOW);
      //Serial.println("fan 1");
      //Serial.println("light 0");
      prev=k;
      bluetooth.println("1");
    }
    if(k=='2')
    {
      digitalWrite(light,HIGH);
      digitalWrite(fan,LOW);
      //Serial.println("fan 0");
      //Serial.println("light 1");
      prev=k;
      bluetooth.println("2");
        
    }
    else if(k=='3')
    {
      digitalWrite(light,HIGH);
      digitalWrite(fan,HIGH);
      //Serial.println("fan 1");
      //Serial.println("light 1");
      prev=k;
      bluetooth.println("3");
    }
    }
    else
    {
    bluetooth.println('PP');
    }
    delay(10);

}

