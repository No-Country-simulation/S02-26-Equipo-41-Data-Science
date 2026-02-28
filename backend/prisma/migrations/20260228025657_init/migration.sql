-- CreateTable
CREATE TABLE "Rol" (
    "rolID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("rolID")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "usuarioID" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoLogin" TIMESTAMP(3),
    "rolID" INTEGER,
    "vendedorID" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuarioID")
);

-- CreateTable
CREATE TABLE "Tiempo" (
    "tiempoID" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "dia" INTEGER,
    "mes" INTEGER,
    "anio" INTEGER,
    "diaSemana" TEXT,
    "esFinDeSemana" BOOLEAN,

    CONSTRAINT "Tiempo_pkey" PRIMARY KEY ("tiempoID")
);

-- CreateTable
CREATE TABLE "Sucursal" (
    "sucursalID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ciudad" TEXT,

    CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("sucursalID")
);

-- CreateTable
CREATE TABLE "Vendedor" (
    "vendedorID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "sucursalID" INTEGER,

    CONSTRAINT "Vendedor_pkey" PRIMARY KEY ("vendedorID")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "clienteID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "dni" TEXT,
    "telefono" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("clienteID")
);

-- CreateTable
CREATE TABLE "MetodoPago" (
    "metodoPagoID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "MetodoPago_pkey" PRIMARY KEY ("metodoPagoID")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "categoriaID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("categoriaID")
);

-- CreateTable
CREATE TABLE "Marca" (
    "marcaID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("marcaID")
);

-- CreateTable
CREATE TABLE "Producto" (
    "productoID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoriaID" INTEGER,
    "marcaID" INTEGER,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("productoID")
);

-- CreateTable
CREATE TABLE "VarianteProducto" (
    "varianteID" SERIAL NOT NULL,
    "talla" TEXT,
    "color" TEXT,
    "sku" TEXT NOT NULL,
    "precioVenta" DECIMAL(65,30) NOT NULL,
    "productoID" INTEGER,

    CONSTRAINT "VarianteProducto_pkey" PRIMARY KEY ("varianteID")
);

-- CreateTable
CREATE TABLE "Venta" (
    "ventaID" SERIAL NOT NULL,
    "sucursalID" INTEGER,
    "vendedorID" INTEGER,
    "clienteID" INTEGER,
    "metodoPagoID" INTEGER,
    "tiempoID" INTEGER,
    "hora" TIMESTAMP(3),
    "totalVenta" DECIMAL(65,30),

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("ventaID")
);

-- CreateTable
CREATE TABLE "DetalleVenta" (
    "detalleID" SERIAL NOT NULL,
    "ventaID" INTEGER,
    "varianteID" INTEGER,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("detalleID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_vendedorID_key" ON "Usuario"("vendedorID");

-- CreateIndex
CREATE INDEX "Tiempo_fecha_idx" ON "Tiempo"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_dni_key" ON "Cliente"("dni");

-- CreateIndex
CREATE INDEX "Producto_categoriaID_idx" ON "Producto"("categoriaID");

-- CreateIndex
CREATE INDEX "Producto_marcaID_idx" ON "Producto"("marcaID");

-- CreateIndex
CREATE UNIQUE INDEX "VarianteProducto_sku_key" ON "VarianteProducto"("sku");

-- CreateIndex
CREATE INDEX "VarianteProducto_productoID_idx" ON "VarianteProducto"("productoID");

-- CreateIndex
CREATE INDEX "Venta_clienteID_idx" ON "Venta"("clienteID");

-- CreateIndex
CREATE INDEX "Venta_vendedorID_idx" ON "Venta"("vendedorID");

-- CreateIndex
CREATE INDEX "Venta_sucursalID_idx" ON "Venta"("sucursalID");

-- CreateIndex
CREATE INDEX "Venta_tiempoID_idx" ON "Venta"("tiempoID");

-- CreateIndex
CREATE INDEX "DetalleVenta_ventaID_idx" ON "DetalleVenta"("ventaID");

-- CreateIndex
CREATE INDEX "DetalleVenta_varianteID_idx" ON "DetalleVenta"("varianteID");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolID_fkey" FOREIGN KEY ("rolID") REFERENCES "Rol"("rolID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_vendedorID_fkey" FOREIGN KEY ("vendedorID") REFERENCES "Vendedor"("vendedorID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendedor" ADD CONSTRAINT "Vendedor_sucursalID_fkey" FOREIGN KEY ("sucursalID") REFERENCES "Sucursal"("sucursalID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaID_fkey" FOREIGN KEY ("categoriaID") REFERENCES "Categoria"("categoriaID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_marcaID_fkey" FOREIGN KEY ("marcaID") REFERENCES "Marca"("marcaID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VarianteProducto" ADD CONSTRAINT "VarianteProducto_productoID_fkey" FOREIGN KEY ("productoID") REFERENCES "Producto"("productoID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_sucursalID_fkey" FOREIGN KEY ("sucursalID") REFERENCES "Sucursal"("sucursalID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_vendedorID_fkey" FOREIGN KEY ("vendedorID") REFERENCES "Vendedor"("vendedorID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_clienteID_fkey" FOREIGN KEY ("clienteID") REFERENCES "Cliente"("clienteID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_metodoPagoID_fkey" FOREIGN KEY ("metodoPagoID") REFERENCES "MetodoPago"("metodoPagoID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_tiempoID_fkey" FOREIGN KEY ("tiempoID") REFERENCES "Tiempo"("tiempoID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_ventaID_fkey" FOREIGN KEY ("ventaID") REFERENCES "Venta"("ventaID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_varianteID_fkey" FOREIGN KEY ("varianteID") REFERENCES "VarianteProducto"("varianteID") ON DELETE SET NULL ON UPDATE CASCADE;
