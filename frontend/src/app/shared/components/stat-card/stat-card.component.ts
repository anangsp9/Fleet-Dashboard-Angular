import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-gray-600 transition-colors">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-neutral-600 dark:text-gray-400 text-sm font-medium">{{ label() }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ value() }}</p>
          @if (subtitle()) {
            <p class="text-neutral-600 dark:text-gray-400 text-xs mt-1">{{ subtitle() }}</p>
          }
        </div>
        <div class="w-12 h-12 rounded-lg flex items-center justify-center" [ngClass]="bgColorClass()">
          <span [innerHTML]="icon()" class="w-6 h-6 text-white"></span>
        </div>
      </div>
      @if (trend() !== undefined) {
        <div class="mt-3 flex items-center gap-2">
          <span class="text-xs font-medium" [class]="trend()! >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ trend()! >= 0 ? '+' : '' }}{{ trend() }}%
          </span>
          <span class="text-neutral-600 dark:text-gray-400 text-xs">vs last week</span>
        </div>
      }
    </div>
  `,
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string | number>();
  icon = input<string>('');
  bgColorClass = input<string>('bg-amber-600');
  subtitle = input<string>('');
  trend = input<number | undefined>(undefined);
}
