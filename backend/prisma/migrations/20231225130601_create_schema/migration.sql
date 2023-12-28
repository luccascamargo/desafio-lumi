-- CreateTable
CREATE TABLE "client" (
    "id" TEXT NOT NULL,
    "client_number" INTEGER NOT NULL,
    "reference_month" TEXT,
    "electrical_energy_value" DOUBLE PRECISION,
    "amount_electrical_energy" DOUBLE PRECISION,
    "sceee_energy_value" DOUBLE PRECISION,
    "amout_sceee_electrical_energy" DOUBLE PRECISION,
    "compensated_energy_value" DOUBLE PRECISION,
    "amount_compensated_energy" DOUBLE PRECISION,
    "contribution" DOUBLE PRECISION
);

-- CreateIndex
CREATE UNIQUE INDEX "client_id_key" ON "client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "client_client_number_key" ON "client"("client_number");
