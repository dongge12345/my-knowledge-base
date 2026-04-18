import type { LocationQueryValue, RouteParamValue } from 'vue-router'

export const getSingleRouteParam = (
    value: RouteParamValue | RouteParamValue[] | undefined
): string | null => {
    if (typeof value === 'string') {
        return value
    }

    if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0]
    }

    return null
}

export const parseRouteId = (
    value: RouteParamValue | RouteParamValue[] | undefined
): number | null => {
    const rawValue = getSingleRouteParam(value)

    if (rawValue === null) {
        return null
    }

    const taskId = Number(rawValue)
    return Number.isInteger(taskId) ? taskId : null
}

export const getSingleQueryValue = (
    value: LocationQueryValue | LocationQueryValue[] | undefined
): string | null => {
    if (typeof value === 'string') {
        return value
    }

    if (Array.isArray(value) && typeof value[0] === 'string') {
        return value[0]
    }

    return null
}
