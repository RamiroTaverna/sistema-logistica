import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { Shipment, ShipmentStatus } from '../models/shipment.model';
import { ShipmentStats } from '../models/stats.model';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private readonly storageKey = 'logistics-shipments';
  private http = inject(HttpClient);
  private shipments$ = new BehaviorSubject<Shipment[]>([]);

  constructor() {
    this.bootstrapData();
  }

  getShipments(): Observable<Shipment[]> {
    return this.shipments$.asObservable();
  }

  getShipmentById(id: number): Shipment | undefined {
    return this.shipments$.value.find((s) => s.id === id);
  }

  addShipment(shipment: Omit<Shipment, 'id'>): void {
    const newShipment: Shipment = { ...shipment, id: this.nextId() };
    const updated = [...this.shipments$.value, newShipment];
    this.persist(updated);
  }

  updateShipment(id: number, shipment: Omit<Shipment, 'id'>): boolean {
    const exists = this.getShipmentById(id);
    if (!exists) {
      return false;
    }
    const updated = this.shipments$.value.map((s) => (s.id === id ? { ...shipment, id } : s));
    this.persist(updated);
    return true;
  }

  deleteShipment(id: number): void {
    const updated = this.shipments$.value.filter((s) => s.id !== id);
    this.persist(updated);
  }

  filterShipments(term: string, status?: ShipmentStatus): Observable<Shipment[]> {
    const normalized = term.toLowerCase();
    return this.getShipments().pipe(
      map((list) =>
        list.filter((s) => {
          const matchesTerm =
            !normalized ||
            s.trackingCode.toLowerCase().includes(normalized) ||
            s.sender.toLowerCase().includes(normalized) ||
            s.recipient.toLowerCase().includes(normalized) ||
            s.origin.toLowerCase().includes(normalized) ||
            s.destination.toLowerCase().includes(normalized);
          const matchesStatus = status ? s.status === status : true;
          return matchesTerm && matchesStatus;
        })
      )
    );
  }

  getStats(): Observable<ShipmentStats> {
    return this.getShipments().pipe(
      map((list) => ({
        total: list.length,
        entregados: list.filter((s) => s.status === 'Entregado').length,
        transito: list.filter((s) => s.status === 'En transito').length,
        demorados: list.filter((s) => s.status === 'Demorado').length,
      }))
    );
  }

  clearAll(): void {
    this.persist([]);
  }

  private persist(data: Shipment[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.shipments$.next(data);
  }

  private nextId(): number {
    const ids = this.shipments$.value.map((s) => s.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private bootstrapData() {
    const persisted = localStorage.getItem(this.storageKey);
    if (persisted) {
      this.shipments$.next(JSON.parse(persisted));
      return;
    }

    this.http
      .get<Shipment[]>('assets/data/shipments.json')
      .pipe(
        catchError(() => of(this.seedData()))
      )
      .subscribe((data) => this.persist(data ?? this.seedData()));
  }

  private seedData(): Shipment[] {
    return [
      {
        id: 1,
        trackingCode: 'PKG-001-ARG',
        sender: 'eShop Latam',
        recipient: 'Maria Gomez',
        origin: 'Buenos Aires',
        destination: 'Cordoba',
        status: 'En transito',
        priority: 'Alta',
        weightKg: 3.2,
        cost: 1500,
        createdAt: '2025-11-10',
        eta: '2025-11-19',
        notes: 'Fragil, manejar con cuidado',
      },
      {
        id: 2,
        trackingCode: 'PKG-002-ARG',
        sender: 'Tech Store',
        recipient: 'Juan Perez',
        origin: 'Rosario',
        destination: 'Mendoza',
        status: 'Entregado',
        priority: 'Media',
        weightKg: 1.5,
        cost: 980,
        createdAt: '2025-11-05',
        eta: '2025-11-14',
        notes: 'Entregado en horario matutino',
      },
      {
        id: 3,
        trackingCode: 'PKG-003-ARG',
        sender: 'Libreria Central',
        recipient: 'Luisa Silva',
        origin: 'Buenos Aires',
        destination: 'La Plata',
        status: 'Demorado',
        priority: 'Alta',
        weightKg: 0.9,
        cost: 400,
        createdAt: '2025-11-07',
        eta: '2025-11-18',
        notes: 'Revision aduanera',
      },
      {
        id: 4,
        trackingCode: 'PKG-004-ARG',
        sender: 'Industrias Norte',
        recipient: 'Diego Ruiz',
        origin: 'Salta',
        destination: 'Neuquen',
        status: 'Pendiente',
        priority: 'Baja',
        weightKg: 12.4,
        cost: 2300,
        createdAt: '2025-11-12',
        eta: '2025-11-26',
        notes: 'Programar retiro',
      },
      {
        id: 5,
        trackingCode: 'PKG-005-ARG',
        sender: 'Moda Express',
        recipient: 'Carla Diaz',
        origin: 'Cordoba',
        destination: 'Santa Fe',
        status: 'En transito',
        priority: 'Media',
        weightKg: 2.1,
        cost: 760,
        createdAt: '2025-11-11',
        eta: '2025-11-20',
        notes: 'Seguro contratado',
      },
    ];
  }
}
