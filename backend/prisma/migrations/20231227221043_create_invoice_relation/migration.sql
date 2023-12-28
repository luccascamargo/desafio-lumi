-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "pdfData" BYTEA NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_id_fkey" FOREIGN KEY ("id") REFERENCES "client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
