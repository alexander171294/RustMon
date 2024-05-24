import { Injectable, Logger } from '@nestjs/common';
import * as redis from 'redis';
import { Subject } from 'rxjs';
import { environment } from 'src/environment';

const crypto = require('crypto');

@Injectable()
export class CacheRedisService {

    private readonly logger = new Logger(CacheRedisService.name);

    private readonly redisClient: redis.RedisClient;
    private onError: Subject<any> = new Subject<any>();

    constructor() {
        this.redisClient = redis.createClient({
            url: environment.redis.url,
            host: environment.redis.host,
            auth_pass: environment.redis.auth_pass,
            port: environment.redis.port
        });
        this.redisClient.on('error', (err) => {
            this.logger.error('Redis cache error ' + err.toString());
            this.onError.next(err);
        });
    }
    
    public getOnError(): Subject<any> {
        return this.onError;
    }

    /**
     * 
     * @param key the key to store in cache and recover
     * @param ttl the time to live seconds (time in cache before auto-remove)
     * @param data the data to save in cache
     */
    public saveInCache(key: string, ttl: number, data: string | object): boolean {
        if(typeof data == 'object') {
            data = JSON.stringify(data);
        }
        return this.redisClient.setex(key, ttl, data);
    }

    /**
     * @param key the key of value saved in cache
     * @param asObject parse json or return string? if json is invalid, return the string
     * @returns false, Object, String
     */
    public getFromCache(key: string, asObject?: boolean): Promise<any> {
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
     * @param key delete key and value from cache.
     */
    public invalidate(key: string) {
        return this.redisClient.del(key);
    }

    /**
     * create hash md5 of data to generate key based on values:
     * @param data data to checksum
     */
    public checksum(data: string) {
        return crypto.createHash('md5').update(data).digest('hex').toString();
    }

    /**
     * 
     * @param key clear kvs.
     */
    public flushAll() {
        return this.redisClient.flushall();
    }

}