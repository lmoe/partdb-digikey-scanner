
export interface DigiKeyData {
    partNumber?: string;
    mfgPartNumber?: string;
    purchaseOrder?: string;
    salesOrderId?: string;
    invoiceId?: string;
    picklistId?: string;
    countryOfOrigin?: string;
    quantity?: number;
}

const keys = {
    partNumber: 'P',
    mfgPartNumber: '1P',
    purchaseOrder: 'K',
    salesOrderId: '1K',
    invoiceId: '10K',
    picklistId: '11K',
    countryOfOrigin: '4L',
    quantity: 'Q',

    begin: '[)>',
    seperator : '\u001d',
}

function findValue(code: string[], key: string) {
    for (const c of code) {
        if (c.startsWith(key)) {
            return c.substring(key.length);
        }
    }
}

function findValueNumber(code: string[], key: string) {
    const value = findValue(code, key);
    if (!value) {
        return;
    }

    return Number(value);
}

export function decodeDigiKeyCode(code: string) {
    if (!code.startsWith(keys.begin)) {
        return;
    }

    const codeSplit = code.split(keys.seperator);

    const data: DigiKeyData = {
        countryOfOrigin: findValue(codeSplit, keys.countryOfOrigin),
        invoiceId: findValue(codeSplit, keys.invoiceId),
        mfgPartNumber: findValue(codeSplit, keys.mfgPartNumber),
        partNumber: findValue(codeSplit, keys.partNumber),
        picklistId: findValue(codeSplit, keys.picklistId),
        purchaseOrder: findValue(codeSplit, keys.purchaseOrder),
        quantity: findValueNumber(codeSplit, keys.quantity),
        salesOrderId: findValue(codeSplit, keys.salesOrderId),
    };

    console.log(data);

    return data;
}