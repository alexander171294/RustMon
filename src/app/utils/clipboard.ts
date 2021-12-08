export class Clipboard {

    public static writeText(textToCopy: string): boolean {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy);
            return true;
        } else {
            return false;
        }
    }

}