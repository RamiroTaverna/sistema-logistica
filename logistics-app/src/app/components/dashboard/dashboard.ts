import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ShipmentService } from '../../services/shipment';
import { Shipment } from '../../models/shipment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, RouterLink, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  private shipmentService = inject(ShipmentService);

  stats$ = this.shipmentService.getStats();
  shipments$ = this.shipmentService.getShipments();

  prioritySummary$ = this.shipments$.pipe(
    map((list) => ({
      alta: list.filter((s) => s.priority === 'Alta').length,
      media: list.filter((s) => s.priority === 'Media').length,
      baja: list.filter((s) => s.priority === 'Baja').length,
    }))
  );

  nextDeliveries$ = this.shipments$.pipe(
    map((list) =>
      [...list]
        .filter((s) => s.status !== 'Entregado')
        .sort((a, b) => a.eta.localeCompare(b.eta))
        .slice(0, 5)
    )
  );

  statusColor(status: Shipment['status']): string {
    switch (status) {
      case 'Entregado':
        return 'success';
      case 'Demorado':
        return 'warning';
      case 'Cancelado':
        return 'danger';
      default:
        return 'info';
    }
  }
}
