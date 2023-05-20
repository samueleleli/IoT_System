#include <Wire.h>
#include <ds3231.h>

struct ts t; 

void setup() {
  Serial.begin(9600);
  Wire.begin();
  DS3231_init(DS3231_CONTROL_INTCN);
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n'); // Legge una linea di testo dalla seriale

    // Estrae i valori dei parametri dal testo ricevuto
    int hour = extractNumber(input, "hour=");
    int min = extractNumber(input, "min=");
    int sec = extractNumber(input, "sec=");
    int mday = extractNumber(input, "mday=");
    int mon = extractNumber(input, "mon=");
    int year = extractNumber(input, "year=");

    // Imposta i parametri sul modulo DS3231
    t.hour = hour;
    t.min = min;
    t.sec = sec;
    t.mday = mday;
    t.mon = mon;
    t.year = year;
    Serial.println(input);
    Serial.println(input.substring(input.indexOf("min=") + 4, input.indexOf(",")));
    Serial.println("hour:");
    Serial.println(hour);
    Serial.println("Min:");
    Serial.println(min);
    Serial.println("Sec:");
    Serial.println(sec);
    Serial.println("Day:");
    Serial.println(mday);
    Serial.println("Mon:");
    Serial.println(mon);
    Serial.println("year:");
    Serial.println(year);

    DS3231_set(t);
    Serial.println("Parametri impostati correttamente!");
  }
}

int extractNumber(String input, String label) {
  int startIndex = input.indexOf(label) + label.length(); // Indice di inizio del numero
  int endIndex = input.indexOf(",", startIndex); // Indice di fine del numero
  String numberString = input.substring(startIndex, endIndex);
  int number = numberString.toInt(); // Converte la stringa in un valore intero
  return number;
}
