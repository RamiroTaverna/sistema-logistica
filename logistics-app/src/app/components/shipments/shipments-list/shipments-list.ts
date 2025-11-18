import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Shipment, ShipmentStatus } from '../../../models/shipment.model';
import { ShipmentService } from '../../../services/shipment';

@Component({
  selector: 'app-shipments-list',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, DatePipe, RouterLink, NgClass],
  templateUrl: './shipments-list.html',
  styleUrl: './shipments-list.css',
})
export class ShipmentsListComponent {
  private shipmentService = inject(ShipmentService);
  private searchTerm$ = new BehaviorSubject<string>('');
  private status$ = new BehaviorSubject<ShipmentStatus | ''>('');
  page$ = new BehaviorSubject<number>(1);
  pageSize = 6;

  shipments$ = this.shipmentService.getShipments();

  filtered$ = combineLatest([this.shipments$, this.searchTerm$, this.status$]).pipe(
    map(([shipments, term, status]) => {
      const normalized = term.toLowerCase();
      return shipments.filter((s) => {
        const matchesTerm =
          !normalized ||
          s.trackingCode.toLowerCase().includes(normalized) ||
          s.recipient.toLowerCase().includes(normalized) ||
          s.sender.toLowerCase().includes(normalized) ||
          s.origin.toLowerCase().includes(normalized) ||
          s.destination.toLowerCase().includes(normalized);
        const matchesStatus = status ? s.status === status : true;
        return matchesTerm && matchesStatus;
      });
    })
  );

  paged$ = combineLatest([this.filtered$, this.page$]).pipe(
    map(([list, page]) => {
      const start = (page - 1) * this.pageSize;
      return list.slice(start, start + this.pageSize);
    })
  );

  totalPages$ = this.filtered$.pipe(map((list) => Math.max(1, Math.ceil(list.length / this.pageSize))));

  statuses: ShipmentStatus[] = ['Pendiente', 'En transito', 'Entregado', 'Demorado', 'Cancelado'];

  onSearch(term: string) {
    this.page$.next(1);
    this.searchTerm$.next(term);
  }

  onFilterByStatus(status: string) {
    this.page$.next(1);
    this.status$.next((status as ShipmentStatus) || '');
  }

  onDelete(shipment: Shipment) {
    const confirmed = confirm(`¿Eliminar el envio ${shipment.trackingCode}?`);
    if (confirmed) {
      this.shipmentService.deleteShipment(shipment.id);
    }
  }

  nextPage(totalPages: number) {
    const current = this.page$.value;
    if (current < totalPages) {
      this.page$.next(current + 1);
    }
  }

  prevPage() {
    const current = this.page$.value;
    if (current > 1) {
      this.page$.next(current - 1);
    }
  }
}
