import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { Router } from '@angular/router';
import { IProduct } from '../products.service';
import { FormBuilder } from '@angular/forms';
import {
  IProductFilters,
  ProductFilterPipe,
} from '../pipes/product-filter.pipe';
import { Ng2SearchPipe } from 'ng2-search-filter';

@Component({
  selector: 'app-products-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit, OnChanges {
  title = 'Product Search / Filter';
  @Input() products: IProduct[];
  @Input() filters: IProductFilters;
  @Input() searchTerm: string;
  @Output() searchTermChange = new EventEmitter<string>();

  private NUM_OF_OPTIONS = 12;

  filterForm = this.fb.group({
    location: '',
    price: this.fb.group({
      min: 0,
      max: 1000,
    }),
    delivery: false,
    productType: '',
    purchaseType: '',
  });
  productOptions: ProductFilterOptions;
  filteredProducts: IProduct[];

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    public router: Router,
    private productFilter: ProductFilterPipe,
    private searchFilter: Ng2SearchPipe
  ) {}

  ngOnInit(): void {
    // This adds automatically a filter for every form element, be careful to exclude form elements with specific filter
    this.filterForm.valueChanges.subscribe((values) => {
      Object.entries(values).forEach(([columnName, value]) => {
        if (value) {
          if (typeof value === 'string') {
            this.filters[columnName] = value;
          } else if (typeof value === 'boolean') {
            this.filters[columnName] = value;
          }
        } else {
          delete this.filters[columnName];
        }
      });
      this.updateOptionCounters();
    });
    this.filterForm.get('price').valueChanges.subscribe((priceValues) => {
      this.filters.price = {
        type: 'isBetween',
        value: priceValues,
      };
    });
  }

  ngOnChanges(): void {
    this.setOptions();
  }

  private setOptions(): void {
    const options: { [key: string]: CountedOption[] | string[] } = {
      location: this.createOption((p) => p.location),
      productType: this.createOption((p) => p.productType),
      purchaseType: this.createOption((p) => p.purchaseType),
    };
    this.productOptions = options;

    this.filterForm
      .get('price')
      .get('max')
      .patchValue(Math.max(...this.products.map((p) => p.price)));
  }

  private createOption(
    accessorFn: (product: IProduct) => string
  ): CountedOption[] {
    // count Occurrences of values
    const occurenceCount = this.products.reduce((resultat, product) => {
      const value = accessorFn(product);
      const valueCounter = resultat.filter((el) => el.value === value)[0];
      if (valueCounter) {
        valueCounter.counter += 1;
      } else {
        resultat.push({
          value,
          counter: 1,
        });
      }
      return resultat;
    }, []);

    // sort by counter and select only the most frequent values
    const sliced = occurenceCount
      .sort((a, b) => b.counter - a.counter)
      .slice(0, this.NUM_OF_OPTIONS);

    return sliced;
  }

  private updateOptionCounters(): void {
    this.filteredProducts = this.searchFilter.transform(
      this.productFilter.transform(this.products, this.filters),
      this.searchTerm
    );
    Object.entries(this.productOptions).forEach(([columnName, options]) =>
      this.updateOptionCounter(columnName, options)
    );
  }

  private updateOptionCounter(
    columnName: string,
    options: CountedOption[] | string[]
  ): void {
    options.forEach((option: CountedOption | string) => {
      if (typeof option !== 'string') {
        option.counter = this.filteredProducts.filter(
          (p) => p[columnName] === option.value
        ).length;
      }
    });
  }
}

interface CountedOption {
  value: string;
  counter: number;
}

interface ProductFilterOptions {
  [key: string]: CountedOption[] | string[];
}
