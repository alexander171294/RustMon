import { Logger } from '@nestjs/common';

export class Queue {
    private readonly logger = new Logger('QueueHandler');

    public inProgress: boolean = false;

    public queue: Promise<any>[] = [];
    public results: any[] = [];

    public addToQueue(promise: Promise<any>): boolean {
        if(!this.inProgress) {
            this.queue.push(promise);
            return true;
        }
        return false;
    }

    public processQueue(): Promise<any[]> {
        if(this.inProgress) {
            return;
        }
        return new Promise<any[]>((res, rej) => {
            this.logger.debug("processing in queue " + this.queue.length)
            if(!this.processNext(res)) {
                this.logger.debug("Queue rejected, nothing to process");
                rej(); // nada para procesar
            }
        });
    }

    private processNext(res) {
        if(this.queue.length > 0) {
            this.inProgress = true;
            this.queue[0].then(uDataRes => {
                this.results.push(uDataRes);
                this.queue.splice(0, 1);
                this.inProgress = false;
                if(!this.processNext(res)) {
                    // nada para procesar, fin de la cola
                    this.logger.debug('finishing queue with results: ' + this.results.length);
                    res(this.results);
                }
            }).catch(err => {
                this.processNext(res);
            });
            return true;
        } else {
            return false;
        }
    }

}