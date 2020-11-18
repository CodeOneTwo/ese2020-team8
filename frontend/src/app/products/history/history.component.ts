import { Component, OnInit } from '@angular/core';
import { TransactionsService, ITransaction } from '../transactions.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  transactions: ITransaction[];
  filteredTransactions: Partial<ITransaction>[];

  constructor(private transactionsService: TransactionsService) {
    this.reloadTransactions();
  }

  ngOnInit(): void {}

  reloadTransactions(): void {
    this.transactionsService.getMyTransactions().subscribe((trans) => {
      this.transactions = trans;
      this.filteredTransactions = trans
    });
  }

  filterSoldHistory(status: string): void {
    if (status === 'buy') {
      this.filteredTransactions = this.transactions.filter((transactions) =>
        ['buy'].includes(transactions.productType)
      );
    } else {
      this.filteredTransactions = [];
    }
  }

  filterRentHistory(status: string): void {
    if (status === 'rent') {
      this.filteredTransactions = this.transactions.filter((transactions) =>
        ['rent'].includes(transactions.productType)
      );
    } else {
      this.filteredTransactions = [];
    }
  }
}
