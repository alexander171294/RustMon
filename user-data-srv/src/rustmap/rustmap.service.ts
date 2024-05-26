import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { first } from "rxjs";

@Injectable()
export class RustMapService {

    private readonly logger = new Logger(RustMapService.name);

    private readonly rustmapURI = 'https://rustmaps.com/map/${size}_${seed}';

    constructor(private http: HttpService) { }

    public getRustData(size: string, seed: string): Promise<RustMapData> {
        return new Promise<RustMapData>((res, rej) => {
            const mapURL = this.rustmapURI.replace('${size}', size).replace('${seed}', seed);
            this.http.get<string>(mapURL+'?embed=i').pipe(first()).subscribe(r => {
                const result = new RustMapData(mapURL);
                // console.log(r.data);
                const mapDetails = /<meta property="og:description" content="([^"]+)">/gmi.exec(r.data);
                if(mapDetails) {
                    result.mapExists = true;
                    result.mapDetails = mapDetails[1];
                    result.mapImage = /<meta name="twitter:image" content="([^"]+)">/.exec(r.data)[1];
                }
                res(result);
            }, e => {
                rej(e);
            });
        });
    }

}

export class RustMapData {
    public mapExists: boolean = false;
    public mapImage: string;
    public mapDetails: string;
    public mapURL: string;
    constructor(url: string) {
        this.mapURL = url;
    }
}