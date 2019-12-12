import WebXmlReader from './WebXmlReader';
import ContextXmlReader from './ContextXmlReader';

class ContextSupport {

    constructor(webXmlPath, contextXmlPath) {
        this.webXmlPath = webXmlPath;
        this.contextXmlPath = contextXmlPath;
    }

    /**
     * Function populates process.env context with values read from web.xml and context.xml
     * context.xml values have higher priority
     * @returns {undefined}
     */
    async buildContext() {
        const fs = require('fs');
        const context = {}
        if (this.webXmlPath && fs.existsSync(this.webXmlPath)) {
            const webxml = fs.readFileSync(this.webXmlPath, 'utf8');
            const wxr = new WebXmlReader(webxml);
            const values = await wxr.getValues();
            Object.assign(context, values);
        }

        if (this.contextXmlPath && fs.existsSync(this.contextXmlPath)) {
            const contextXml = fs.readFileSync(this.contextXmlPath, 'utf8');
            const cxr = new ContextXmlReader(contextXml);
            const values = await cxr.getValues();
            ContextSupport.assignExisting(context, values);
        }

        return context;
    }

    static assignExisting(target, source) {
        for (var prop in source) {
            if (source.hasOwnProperty(prop) && target.hasOwnProperty(prop)) {
                target[prop] = source[prop];
            }
        }
    }

}

export default ContextSupport;