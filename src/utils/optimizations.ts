// utils/optimizations.ts

// Optimasi untuk komponen-komponen UI yang berat
export const optimizeComponent = <T extends Record<string, any>>(
  componentProps: T,
  options: {
    shouldMemo?: boolean;
    shouldDebounce?: boolean;
    debounceDelay?: number;
  } = {}
) => {
  const { shouldMemo = true, shouldDebounce = false, debounceDelay = 300 } = options;

  // Jika komponen memerlukan memoisasi
  if (shouldMemo) {
    // Di sini akan digunakan React.memo secara eksternal
    // karena kita tidak bisa mengembalikan komponen React dari fungsi utilitas
  }

  // Jika komponen perlu didebounce
  if (shouldDebounce) {
    return debounced(componentProps, debounceDelay);
  }

  return componentProps;
};

// Fungsi debounce untuk mengurangi panggilan fungsi yang sering
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | null;
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Fungsi debounce yang mengembalikan promise
export function debounced<T extends Record<string, any>>(obj: T, delay: number): T {
  const debouncedObj = {} as T;
  for (const key in obj) {
    if (typeof obj[key] === 'function') {
      (debouncedObj as any)[key] = debounce(obj[key], delay);
    } else {
      (debouncedObj as any)[key] = obj[key];
    }
  }
  return debouncedObj;
}

// Optimasi untuk list dan array besar
export const optimizeList = <T,>(
  items: T[],
  options: {
    chunkSize?: number;
    shouldPaginate?: boolean;
    itemsPerPage?: number;
  } = {}
) => {
  const { 
    chunkSize = 100, 
    shouldPaginate = false, 
    itemsPerPage = 20 
  } = options;

  if (!shouldPaginate) {
    // Jika tidak ada pagination, kita bisa chunk items untuk render bertahap
    const chunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }
    return chunks;
  } else {
    // Jika menggunakan pagination
    return {
      items: items,
      totalPages: Math.ceil(items.length / itemsPerPage),
      getPage: (page: number) => {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
      }
    };
  }
};

// Fungsi untuk menghapus properti yang tidak digunakan
export const removeUnusedProps = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  allowedProps: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of allowedProps) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

// Optimasi untuk event handlers
export const createOptimizedHandler = <T extends (...args: any[]) => any>(
  fn: T,
  options: {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    throttle?: boolean;
    throttleDelay?: number;
  } = {}
) => {
  const { 
    preventDefault = false, 
    stopPropagation = false, 
    throttle = false, 
    throttleDelay = 100 
  } = options;

  if (throttle) {
    return throttleFunction(
      (e: any) => {
        if (preventDefault && e?.preventDefault) e.preventDefault();
        if (stopPropagation && e?.stopPropagation) e.stopPropagation();
        return fn(e);
      },
      throttleDelay
    );
  }

  return (e: any) => {
    if (preventDefault && e?.preventDefault) e.preventDefault();
    if (stopPropagation && e?.stopPropagation) e.stopPropagation();
    return fn(e);
  };
};

// Fungsi throttle
function throttleFunction<T extends (...args: any[]) => any>(func: T, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}