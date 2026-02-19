describe('Health Check Inicial', () => {
  it('debería confirmar que Jest y Nest funcionan', () => {
    expect(1 + 1).toBe(2);
  });

  it('debería tener el entorno definido', () => {
    expect(process.env).toBeDefined();
  });
});