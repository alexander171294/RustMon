import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { RustEvent } from './RustEvent';

@Injectable({
  providedIn: 'root'
})
export class RustEventsService {

  private reportList: Report[] = [];

  constructor(private messageService: MessageService) {
    this.loadReports();
  }

  public process(re: RustEvent) {
    if(re.raw.indexOf('[PlayerReport]') > 0) {
      this.parseReport(re);
    }
  }

  private parseReport(re: RustEvent) {
    const report = /\[PlayerReport\]\s([^\[]+)\[([^\]]+)\]\sreported\s([^\[]+)\[([^\]]+)\]\s-\s(.*)/.exec(re.raw) as RegExpExecArray;
    const reportObj = new Report();
    reportObj.reporter = {
      steamID: report[2],
      nick: report[1]
    };
    reportObj.reported = {
      steamID: report[4],
      nick: report[3]
    };
    reportObj.message = report[5];
    this.notifyAndSaveReport(reportObj);
  }

  private notifyAndSaveReport(report: Report) {
    this.messageService.add({severity: 'error', summary:  `${report.reporter?.nick} F7 report: ${report.reported?.nick}`, detail: report.message});
    this.reportList.push(report);
    this.saveReports();
  }

  public saveReports() {
    localStorage.setItem('reports', JSON.stringify(this.reportList));
  }

  public loadReports() {
    const reports = JSON.parse(localStorage.getItem('reports') as string);
    if(reports) {
      this.reportList = reports;
    }
  }
}


export class Report {
  public reporter?: PlayerReportData;
  public reported?: PlayerReportData;
  public message: string = '';
}

export class PlayerReportData {
  public steamID: string = '';
  public nick: string = '';
}
