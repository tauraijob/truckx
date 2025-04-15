<template>
    <nav class="space-y-1">
        <NuxtLink to="/dashboard/admin" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/admin' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <HomeIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/admin' ? 'text-white' : 'text-primary-700']" />
            Dashboard
        </NuxtLink>

        <NuxtLink to="/dashboard/admin/users" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/admin/users' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <UsersIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/admin/users' ? 'text-white' : 'text-primary-700']" />
            Users
        </NuxtLink>

        <NuxtLink to="/dashboard/admin/loads" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/admin/loads' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <ClipboardDocumentListIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/admin/loads' ? 'text-white' : 'text-primary-700']" />
            Loads
        </NuxtLink>

        <NuxtLink to="/dashboard/admin/trucks" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/admin/trucks' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <TruckIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/admin/trucks' ? 'text-white' : 'text-primary-700']" />
            Trucks
        </NuxtLink>

        <NuxtLink to="/dashboard/admin/orders" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/admin/orders' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <ClipboardDocumentCheckIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/admin/orders' ? 'text-white' : 'text-primary-700']" />
            Orders
        </NuxtLink>

        <NuxtLink to="/dashboard/admin/payments" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/admin/payments' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <CurrencyDollarIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/admin/payments' ? 'text-white' : 'text-primary-700']" />
            Payments
        </NuxtLink>

        <NuxtLink to="/dashboard/admin/settings" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/admin/settings' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <Cog6ToothIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/admin/settings' ? 'text-white' : 'text-primary-700']" />
            Settings
        </NuxtLink>
    </nav>
</template> 