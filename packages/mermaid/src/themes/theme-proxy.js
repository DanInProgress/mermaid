import { isValid } from 'khroma';
import { getThemeVariables as baseThemeVariables } from './theme-base';

/** HideBadColors .  */
class HideBadColors {
  isColorProp(property) {
    return property.endsWith('Color') || property === 'background';
  }
  get(target, property) {
    if (!(property in target)) {
      return undefined;
    }

    const value = target[property];
    if (typeof value !== 'string') {
      return undefined;
    }

    // if it's a color related property, only return it if valid.
    if (this.isColorProp(property) && isValid(value)) {
      return value;
    }

    return undefined;
  }

  has(target, property) {
    if (!(property in target)) {
      return false;
    }

    const value = target[property];
    if (typeof value !== 'string') {
      return false;
    }

    // if it's a color related property, only return it if valid.
    if (this.isColorProp(property)) {
      return isValid(value);
    }
  }

  ownKeys(target) {
    const keys = [];
    Object.keys(target).forEach((property) => {
      if (this.has(target, property)) {
        keys.push(property);
      }
    });
    return keys;
  }
}

class ProxyTheme {
  constructor(userOverrides) {
    this.userOverrides = userOverrides;
  }

  static construct(target, args) {
    return new Proxy(new target(...args), new ProxyTheme());
  }

  get(target, property) {
    if (property === 'calculate') {
      return (userOverrides) => {
        this.userOverrides = userOverrides;
        target.calculate(new Proxy(userOverrides, HideBadColors));
      };
    }
    if (this.userOverrides && property in this.userOverrides) {
      return this.userOverrides[property];
    }
    return target[property];
  }

  set(target, property, value) {
    target[property] = value;
  }

  has(target, property) {
    if (property === 'calculate') {
      return true;
    }
    if (this.userOverrides && property in this.userOverrides) {
      return true;
    }
    return property in target;
  }

  ownKeys(target) {
    let uniq = {};
    Object.keys(this.userOverrides).forEach((p) => {
      uniq[p] = true;
    });
    Object.keys(target).forEach((p) => {
      uniq[p] = true;
    });
    return Object.keys(uniq);
  }
}

export const getThemeVariables = (userOverrides) => {
  const proxy = new ProxyTheme(userOverrides);
  const target = baseThemeVariables(new Proxy(userOverrides, HideBadColors));
  const theme = new Proxy(target, proxy);

  return theme;
};
