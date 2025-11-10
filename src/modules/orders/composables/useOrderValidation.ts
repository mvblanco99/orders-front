import type { CreateOrderDto, CreateOrderPartDto, UpdateOrderDto } from '../interfaces/order.dto';

/**
 * Validaciones para el frontend antes de enviar al backend
 */
export const useOrderValidation = () => {
  /**
   * Validar DTO de creación de orden
   */
  const validateCreateOrder = (dto: CreateOrderDto): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validar zoneId
    if (!dto.zoneId || dto.zoneId <= 0) {
      errors.push('La zona es obligatoria');
    }

    // Validar totalUnits
    if (!dto.totalUnits || dto.totalUnits <= 0) {
      errors.push('El total de unidades debe ser mayor a 0');
    }

    // Validar totalParts
    if (!dto.totalParts || dto.totalParts <= 0) {
      errors.push('El total de partes debe ser mayor a 0');
    }

    // Validar orderNumber
    if (!dto.orderNumber || dto.orderNumber.trim() === '') {
      errors.push('El número de orden es obligatorio');
    }

    // Validar parts
    if (!dto.parts || dto.parts.length === 0) {
      errors.push('Debe agregar al menos una parte');
    } else {
      // Validar que el número de partes coincida con totalParts
      if (dto.parts.length !== dto.totalParts) {
        errors.push(
          `El número de partes (${dto.parts.length}) no coincide con el total de partes esperado (${dto.totalParts})`,
        );
      }

      // Validar cada parte
      dto.parts.forEach((part, index) => {
        if (!part.partNumber || part.partNumber <= 0) {
          errors.push(`La parte ${index + 1} tiene un número inválido`);
        }
        if (!part.quantity || part.quantity <= 0) {
          errors.push(`La parte ${index + 1} debe tener cantidad mayor a 0`);
        }
        if (!part.pickerId || part.pickerId <= 0) {
          errors.push(`La parte ${index + 1} debe tener un picker asignado`);
        }
      });

      // Verificar que la suma de cantidades coincida con totalUnits
      const sumQuantities = dto.parts.reduce((sum, part) => sum + (part.quantity || 0), 0);
      if (sumQuantities !== dto.totalUnits) {
        errors.push(
          `La suma de cantidades de las partes (${sumQuantities}) no coincide con el total de unidades (${dto.totalUnits})`,
        );
      }

      // Verificar que no haya números de parte duplicados
      const partNumbers = dto.parts.map((p) => p.partNumber);
      const uniquePartNumbers = new Set(partNumbers);
      if (partNumbers.length !== uniquePartNumbers.size) {
        errors.push('Hay números de parte duplicados');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  /**
   * Validar parte individual
   */
  const validatePart = (part: CreateOrderPartDto): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!part.partNumber || part.partNumber <= 0) {
      errors.push('Número de parte inválido');
    }
    if (!part.quantity || part.quantity <= 0) {
      errors.push('La cantidad debe ser mayor a 0');
    }
    if (!part.pickerId || part.pickerId <= 0) {
      errors.push('Debe asignar un picker');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  /**
   * Validar DTO de actualización
   */
  const validateUpdateOrder = (dto: UpdateOrderDto): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validar orderNumber si está presente
    if (dto.orderNumber !== undefined && dto.orderNumber.trim() === '') {
      errors.push('El número de orden no puede estar vacío');
    }

    // Validar zoneId si está presente
    if (dto.zoneId !== undefined && dto.zoneId <= 0) {
      errors.push('La zona debe ser válida');
    }

    // Validar totalUnits si está presente
    if (dto.totalUnits !== undefined && dto.totalUnits <= 0) {
      errors.push('El total de unidades debe ser mayor a 0');
    }

    // Validar partsToCreate
    if (dto.partsToCreate && dto.partsToCreate.length > 0) {
      dto.partsToCreate.forEach((part, index) => {
        if (!part.partNumber || part.partNumber <= 0) {
          errors.push(`Nueva parte ${index + 1}: número inválido`);
        }
        if (!part.quantity || part.quantity <= 0) {
          errors.push(`Nueva parte ${index + 1}: cantidad debe ser mayor a 0`);
        }
        if (!part.pickerId || part.pickerId <= 0) {
          errors.push(`Nueva parte ${index + 1}: debe asignar un picker`);
        }
      });
    }

    // Validar partsToUpdate
    if (dto.partsToUpdate && dto.partsToUpdate.length > 0) {
      dto.partsToUpdate.forEach((part, index) => {
        if (!part.id || part.id <= 0) {
          errors.push(`Parte a actualizar ${index + 1}: ID inválido`);
        }
        if (part.quantity !== undefined && part.quantity <= 0) {
          errors.push(`Parte a actualizar ${index + 1}: cantidad debe ser mayor a 0`);
        }
        if (part.pickerId !== undefined && part.pickerId <= 0) {
          errors.push(`Parte a actualizar ${index + 1}: picker debe ser válido`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  /**
   * Calcular distribución equitativa de unidades entre partes
   */
  const calculateDistribution = (totalUnits: number, totalParts: number): number[] => {
    if (totalParts <= 0) return [];

    const baseQuantity = Math.floor(totalUnits / totalParts);
    const remainder = totalUnits % totalParts;

    const distribution: number[] = [];
    for (let i = 0; i < totalParts; i++) {
      // Distribuir el resto añadiendo 1 a las primeras partes
      distribution.push(baseQuantity + (i < remainder ? 1 : 0));
    }

    return distribution;
  };

  /**
   * Validar IDs de partes para asignación
   */
  const validatePartIds = (partIds: number[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!partIds || partIds.length === 0) {
      errors.push('Debe seleccionar al menos una parte');
    }

    if (partIds.some((id) => !id || id <= 0)) {
      errors.push('Hay IDs de partes inválidos');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  return {
    validateCreateOrder,
    validatePart,
    validateUpdateOrder,
    validatePartIds,
    calculateDistribution,
  };
};
