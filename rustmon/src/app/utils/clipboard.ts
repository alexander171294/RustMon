export class Clipboard {

    public static writeText(textToCopy: string): boolean {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(textToCopy);
            return true;
        } else {
            const el = document.createElement('textarea');
            el.value = textToCopy;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            try {
                document.execCommand('copy');
            } catch(e) {
                document.body.removeChild(el);
                return false;
            }
            document.body.removeChild(el);
            return true;
        }
    }

}