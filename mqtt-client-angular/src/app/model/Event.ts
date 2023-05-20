export class Event {
  topic: string;
  value: string;
  timestamp: string;

  constructor(topic: string, value: string, timestamp: string) {
    this.topic = this.convertTopic(topic);
    this.value = value
    this.timestamp = this.convertTimestamp(timestamp);
  }

  private convertTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const formattedTimestamp = date.toISOString().slice(0, 19).replace('T', ' ');
    return formattedTimestamp;
  }
  private convertTopic(topic: string): string {
    switch(topic){
      case "led":
        return "Led"
      case "proxZone":
        return "Ultrasuoni"
      case "movimento":
        return "Movimento"
      case "prossimita":
        return "Ultrasuoni"
    }
    return "N/D";
  }
}
