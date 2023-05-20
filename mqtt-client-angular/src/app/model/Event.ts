export class Event {
  topic: string;
  value: string;
  timestamp: string;

  constructor(topic: string, value: string, timestamp: string) {
    this.topic = topic;
    this.value = value;
    this.timestamp = this.convertTimestamp(timestamp);
  }

  private convertTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const formattedTimestamp = date.toISOString().slice(0, 19).replace('T', ' ');
    return formattedTimestamp;
  }
}
