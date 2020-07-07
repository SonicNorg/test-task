CREATE TABLE CUSTOMER (
                          PERSONAL_ACCOUNT_ID NUMERIC GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) CONSTRAINT CUSTOMER_PK PRIMARY KEY,
                          MSISDN NUMERIC(15) NOT NULL CONSTRAINT CUSTOMER_UNIQUE_MSISDN UNIQUE,
                          ACTIVE NUMERIC(1) NOT NULL CHECK (ACTIVE IN (0, 1))
);

CREATE TABLE PAYMENT (
                         PAYMENT_ID RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
                         PAYMENT_DATE TIMESTAMP WITH TIME ZONE NOT NULL,
                         EXTERNAL_OPERATION_ID NUMERIC(20) NOT NULL,
                         PERSONAL_ACCOUNT_ID NUMERIC(20) NOT NULL,
                         TRANSACTION_AMOUNT NUMERIC(9),
                         SUCCESS NUMERIC(1) NOT NULL CHECK (SUCCESS IN (0, 1)),
                         PAYMENT_MOMENT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT PAYMENT_CUSTOMER_FK FOREIGN KEY (PERSONAL_ACCOUNT_ID) REFERENCES CUSTOMER (PERSONAL_ACCOUNT_ID)
);

CREATE TABLE BALANCE (
                         BALANCE_ID NUMERIC GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1) CONSTRAINT BALANCE_PK PRIMARY KEY,
                         PERSONAL_ACCOUNT_ID NUMERIC(20) NOT NULL,
                         BALANCE NUMERIC(9),
                         BALANCE_CHANGE_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT BALANCE_CUSTOMER_FK FOREIGN KEY (PERSONAL_ACCOUNT_ID) REFERENCES CUSTOMER (PERSONAL_ACCOUNT_ID)
);

CREATE INDEX PAYMENT_OPERATION_ID ON PAYMENT(EXTERNAL_OPERATION_ID);

CREATE OR REPLACE TRIGGER AFTER_PAYMENT_INSERT
    AFTER INSERT ON PAYMENT
    FOR EACH ROW
DECLARE
    oldBalance NUMERIC(9);
BEGIN
    IF :new.SUCCESS = 1 THEN
        oldBalance := 0;
        SELECT BALANCE INTO oldBalance FROM BALANCE;
        UPDATE BALANCE set
                            BALANCE = oldBalance + :new.TRANSACTION_AMOUNT,
                            BALANCE_CHANGE_DATE = CURRENT_TIMESTAMP
            WHERE PERSONAL_ACCOUNT_ID = :new.PERSONAL_ACCOUNT_ID;
    END IF;
END;

CREATE OR REPLACE TRIGGER RESTRICT_PAYMENT_UPD_DEL
    BEFORE DELETE OR UPDATE ON PAYMENT
DECLARE
    NO_PAYMENT_MODIFICATIONS_ALLOWED EXCEPTION;
BEGIN
RAISE NO_PAYMENT_MODIFICATIONS_ALLOWED;
END;

CREATE OR REPLACE TRIGGER AFTER_CUSTOMER_INSERT
    AFTER INSERT ON CUSTOMER
    FOR EACH ROW
BEGIN
INSERT INTO BALANCE (PERSONAL_ACCOUNT_ID, BALANCE) VALUES (:new.PERSONAL_ACCOUNT_ID, 0);
END;
