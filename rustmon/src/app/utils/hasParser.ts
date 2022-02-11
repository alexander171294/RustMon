export class HashParser {

    public static getHashParams(): {[key: string]: string} {
        const parts = window.location.hash.split(';');
        const kv = parts.filter(part => part.indexOf('=') >= 0).map(part => part.split('='));
        const out: any = {};
        kv.forEach(kvi => {
            out[kvi[0]] = kvi[1];
        })
        return out;
    }

}
