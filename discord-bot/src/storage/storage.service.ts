import { environment } from 'src/environment';
import { Injectable, Logger } from '@nestjs/common';
import * as redis from 'redis';
import { Subject } from 'rxjs';

@Injectable()
export class StorageService {

    private readonly logger = new Logger(StorageService.name);

    private readonly redisClient: redis.RedisClient;
    private onError: Subject<any> = new Subject<any>();

    constructor() {
        this.redisClient = redis.createClient({
            host: environment.redisHost,
            auth_pass: environment.redisPass,
            port: environment.redisPort
        });
        this.redisClient.on('error', (err) => {
            this.logger.error('Redis kvs error ' + err.toString());
            this.onError.next(err);
        });
    }
    
    public getOnError(): Subject<any> {
        return this.onError;
    }

    /**
     * 
     * @param key the key to store in kvs and recover
     * @param data the data to save in kvs
     */
    public put(key: string, data: string | object): boolean {
        if(typeof data == 'object') {
            data = JSON.stringify(data);
        }
        return this.redisClient.set(key, data);
    }

    /**
     * @param key the key of value saved in cache
     * @param asObject parse json or return string? if json is invalid, return the string
     * @returns false, Object, String
     */
    public get(key: string, asObject?: boolean): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.redisClient.get(key, (err, data) => {
                if(err) {
                    rej(err);
                } else {
                    if(data) {
                        if(asObject) {
                            try {
                                const _data = JSON.parse(data);
                                if(_data) {
                                    data = _data;
                                }
                            } catch(e) {}
                        }
                        res(data);
                    } else {
                        res(false);
                    }
                }
            });
        });
    }

    /**
     * 
     * @param key delete key and value from store.
     */
    public del(key: string) {
        return this.redisClient.del(key);
    }

}
