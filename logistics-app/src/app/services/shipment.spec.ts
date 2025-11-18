import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShipmentService } from './shipment';
import { Shipment } from '../models/shipment.model';

describe('ShipmentService (mock/localStorage)', () => {
  const seed: Shipment[] = [
    {
      id: 1,
      trackingCode: 'PKG-001',
      sender: 'Origen',
      recipient: 'Destino',
      origin: 'Buenos Aires',
      destination: 'Cordoba',
      status: 'En transito',
      priority: 'Alta',
      weightKg: 1,
      cost: 100,
      createdAt: '2025-01-01',
      eta: '2025-01-05',
    },
    {
      id: 2,
      trackingCode: 'PKG-002',
      sender: 'Origen',
      recipient: 'Destino',
      origin: 'Rosario',
      destination: 'Mendoza',
      status: 'Entregado',
      priority: 'Media',
      weightKg: 2,
      cost: 200,
      createdAt: '2025-01-02',
      eta: '2025-01-06',
    },
  ];

  let service: ShipmentService;

  beforeEach(() => {
    localStorage.setItem('logistics-shipments', JSON.stringify(seed));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ShipmentService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('carga datos desde localStorage y calcula stats', (done) => {
    service.getStats().subscribe((stats) => {
      expect(stats.total).toBe(seed.length);
      expect(stats.transito).toBe(1);
      expect(stats.entregados).toBe(1);
      done();
    });
  });

  it('agrega un envio y lo incluye en el listado', (done) => {
    service.addShipment({
      trackingCode: 'PKG-999',
      sender: 'Tienda',
      recipient: 'Cliente',
      origin: 'Salta',
      destination: 'Neuquen',
      status: 'Pendiente',
      priority: 'Baja',
      weightKg: 3.5,
      cost: 500,
      createdAt: '2025-02-01',
      eta: '2025-02-07',
      notes: 'Prueba',
    });

    service.getShipments().subscribe((list) => {
      expect(list.length).toBe(seed.length + 1);
      expect(list.some((s) => s.trackingCode === 'PKG-999')).toBeTrue();
      done();
    });
  });
});
