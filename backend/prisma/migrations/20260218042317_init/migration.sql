-- CreateTable
CREATE TABLE "Tiempo" (
    "tiempoID" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "dia" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "diaSemana" TEXT NOT NULL,
    "esFinDeSemana" BOOLEAN NOT NULL,

    CONSTRAINT "Tiempo_pkey" PRIMARY KEY ("tiempoID")
);

-- CreateTable
CREATE TABLE "Sucursal" (
    "sucursalID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,

    CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("sucursalID")
);

-- CreateTable
CREATE TABLE "Vendedor" (
    "vendedorID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "sucursalID" INTEGER NOT NULL,

    CONSTRAINT "Vendedor_pkey" PRIMARY KEY ("vendedorID")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "clienteID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,

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
CREATE TABLE "Producto" (
    "productoID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoriaID" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("productoID")
);

-- CreateTable
CREATE TABLE "VarianteProducto" (
    "varianteID" SERIAL NOT NULL,
    "talla" TEXT,
    "color" TEXT,
    "sku" TEXT NOT NULL,
    "precioVenta" DOUBLE PRECISION NOT NULL,
    "productoID" INTEGER NOT NULL,

    CONSTRAINT "VarianteProducto_pkey" PRIMARY KEY ("varianteID")
);

-- CreateTable
CREATE TABLE "Venta" (
    "ventaID" SERIAL NOT NULL,
    "sucursalID" INTEGER NOT NULL,
    "vendedorID" INTEGER NOT NULL,
    "clienteID" INTEGER NOT NULL,
    "metodoPagoID" INTEGER NOT NULL,
    "tiempoID" INTEGER NOT NULL,
    "hora" TIMESTAMP(3) NOT NULL,
    "totalVenta" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("ventaID")
);

-- CreateTable
CREATE TABLE "DetalleVenta" (
    "detalleID" SERIAL NOT NULL,
    "ventaID" INTEGER NOT NULL,
    "varianteID" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleVenta_pkey" PRIMARY KEY ("detalleID")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "proveedorID" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("proveedorID")
);

-- CreateTable
CREATE TABLE "Compra" (
    "compraID" SERIAL NOT NULL,
    "proveedorID" INTEGER NOT NULL,
    "sucursalID" INTEGER NOT NULL,
    "tiempoID" INTEGER NOT NULL,
    "metodoPagoID" INTEGER NOT NULL,
    "totalCompra" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("compraID")
);

-- CreateTable
CREATE TABLE "DetalleCompra" (
    "detalleCompraID" SERIAL NOT NULL,
    "compraID" INTEGER NOT NULL,
    "varianteID" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleCompra_pkey" PRIMARY KEY ("detalleCompraID")
);

-- AddForeignKey
ALTER TABLE "Vendedor" ADD CONSTRAINT "Vendedor_sucursalID_fkey" FOREIGN KEY ("sucursalID") REFERENCES "Sucursal"("sucursalID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaID_fkey" FOREIGN KEY ("categoriaID") REFERENCES "Categoria"("categoriaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VarianteProducto" ADD CONSTRAINT "VarianteProducto_productoID_fkey" FOREIGN KEY ("productoID") REFERENCES "Producto"("productoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_sucursalID_fkey" FOREIGN KEY ("sucursalID") REFERENCES "Sucursal"("sucursalID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_vendedorID_fkey" FOREIGN KEY ("vendedorID") REFERENCES "Vendedor"("vendedorID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_clienteID_fkey" FOREIGN KEY ("clienteID") REFERENCES "Cliente"("clienteID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_metodoPagoID_fkey" FOREIGN KEY ("metodoPagoID") REFERENCES "MetodoPago"("metodoPagoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_tiempoID_fkey" FOREIGN KEY ("tiempoID") REFERENCES "Tiempo"("tiempoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_ventaID_fkey" FOREIGN KEY ("ventaID") REFERENCES "Venta"("ventaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleVenta" ADD CONSTRAINT "DetalleVenta_varianteID_fkey" FOREIGN KEY ("varianteID") REFERENCES "VarianteProducto"("varianteID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_proveedorID_fkey" FOREIGN KEY ("proveedorID") REFERENCES "Proveedor"("proveedorID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_sucursalID_fkey" FOREIGN KEY ("sucursalID") REFERENCES "Sucursal"("sucursalID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_tiempoID_fkey" FOREIGN KEY ("tiempoID") REFERENCES "Tiempo"("tiempoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_metodoPagoID_fkey" FOREIGN KEY ("metodoPagoID") REFERENCES "MetodoPago"("metodoPagoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCompra" ADD CONSTRAINT "DetalleCompra_compraID_fkey" FOREIGN KEY ("compraID") REFERENCES "Compra"("compraID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCompra" ADD CONSTRAINT "DetalleCompra_varianteID_fkey" FOREIGN KEY ("varianteID") REFERENCES "VarianteProducto"("varianteID") ON DELETE RESTRICT ON UPDATE CASCADE;
