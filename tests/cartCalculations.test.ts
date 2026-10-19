import { describe, it, expect } from "vitest";

interface ServerCartItem {
  productId: string;
  quantity: number;
}

// Emulate backend pricing authority
const MOCK_TRUSTED_CATALOG: Record<string, { price: number; stock: number }> = {
  "prod-kb-001": { price: 198.0, stock: 45 },
  "prod-mouse-002": { price: 159.0, stock: 60 },
  "prod-kb-003": { price: 44.99, stock: 85 },
};

function calculateServerOrderTotal(clientItems: ServerCartItem[]) {
  if (!clientItems || clientItems.length === 0) {
    throw new Error("Cart is empty");
  }

  let subtotal = 0;
  for (const item of clientItems) {
    const catalogItem = MOCK_TRUSTED_CATALOG[item.productId];
    if (!catalogItem) {
      throw new Error(`Product ID ${item.productId} does not exist in catalog.`);
    }
    if (item.quantity <= 0) {
      throw new Error(`Invalid quantity for product ${item.productId}`);
    }
    if (item.quantity > catalogItem.stock) {
      throw new Error(`Requested quantity exceeds available stock.`);
    }
    // Always use trusted catalog price, ignoring whatever client sent
    subtotal += catalogItem.price * item.quantity;
  }

  subtotal = Number(subtotal.toFixed(2));
  const shippingFee = subtotal > 100 ? 0.0 : 9.99;
  const taxFee = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + shippingFee + taxFee).toFixed(2));

  return { subtotal, shippingFee, taxFee, total };
}

describe("Server-Side Price Authority & Anti-Tampering Engine", () => {
  it("calculates accurate subtotal, shipping, and tax from trusted catalog", () => {
    const items = [
      { productId: "prod-kb-001", quantity: 1 }, // $198.00
      { productId: "prod-kb-003", quantity: 2 }, // 2 * $44.99 = $89.98
    ];
    // Subtotal = 198 + 89.98 = 287.98 (> 100 so free shipping)
    // Tax = 287.98 * 0.05 = 14.40
    // Total = 302.38
    const result = calculateServerOrderTotal(items);
    expect(result.subtotal).toBe(287.98);
    expect(result.shippingFee).toBe(0.0);
    expect(result.taxFee).toBe(14.4);
    expect(result.total).toBe(302.38);
  });

  it("applies shipping fee for orders under $100", () => {
    const items = [{ productId: "prod-kb-003", quantity: 1 }]; // $44.99
    const result = calculateServerOrderTotal(items);
    expect(result.subtotal).toBe(44.99);
    expect(result.shippingFee).toBe(9.99);
    expect(result.taxFee).toBe(2.25);
    expect(result.total).toBe(57.23);
  });

  it("rejects non-existent product IDs attempting injection", () => {
    const items = [{ productId: "unknown-hacked-item", quantity: 1 }];
    expect(() => calculateServerOrderTotal(items)).toThrow(/does not exist in catalog/);
  });

  it("rejects negative or zero quantities", () => {
    const items = [{ productId: "prod-kb-001", quantity: -2 }];
    expect(() => calculateServerOrderTotal(items)).toThrow(/Invalid quantity/);
  });
});
