export class CacheKeyBuilder {

    static ORIGINAL_STR_FN = Object.prototype.toString;

    private parts:Array<any> = [];

    constructor(parts?:Array<any>) {
        this.append(parts);
    }

    public static make(...args:Array<any>):CacheKeyBuilder {
        return new CacheKeyBuilder(args);
    }

    /**
     * We must prevent recursion using this method if an object has an overridden method
     */
    public appendObjectName(userObject:any):CacheKeyBuilder {
        this.parts.push(userObject.constructor.name);
        return this;
    }

    public append(...parts:any[]):CacheKeyBuilder {
        parts.forEach((part:any) => {
            if (isBlank(part)) {
                this.parts.push(part === null ? "null" : "undefined");
            } else {
                if (Array.isArray(part)) {
                    (part as Array<any>).forEach((partItem:any) => this.append(partItem));
                } else if (isDate(part)) {
                    this.parts.push((part as Date).getTime());
                } else {
                    if (part.toString && part.toString !== CacheKeyBuilder.ORIGINAL_STR_FN) {
                        /**
                         * If we have overridden the original method, we must use toString() value for identifying the object
                         */
                        this.parts.push(part);
                    } else {
                        this.appendObjectName(part);
                    }
                }
            }
        });
        return this;
    }

    public build():string {
        return this.parts.join('.');
    }
}

export function isDate(obj) {
    return obj instanceof Date && !isNaN(obj.valueOf());
}

export function isBlank(obj) {
    return obj === undefined || obj === null;
}

export function generateUUID() {
    let currentDate:number = Date.now();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const result:number = (currentDate + Math.random() * 16) % 16 | 0;
        currentDate = Math.floor(currentDate / 16);
        return (c == 'x' ? result : (result & 0x3 | 0x8)).toString(16);
    });
}
