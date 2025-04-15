<template>
    <nav class="space-y-1">
        <NuxtLink to="/dashboard/load-provider" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/load-provider' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <HomeIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/load-provider' ? 'text-white' : 'text-primary-700']" />
            Dashboard
        </NuxtLink>

        <NuxtLink to="/dashboard/load-provider/loads" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/load-provider/loads' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <ClipboardDocumentListIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/load-provider/loads' ? 'text-white' : 'text-primary-700']" />
            My Loads
        </NuxtLink>

        <NuxtLink to="/dashboard/load-provider/trucks" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/load-provider/trucks' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <TruckIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/load-provider/trucks' ? 'text-white' : 'text-primary-700']" />
            Available Trucks
        </NuxtLink>

        <NuxtLink to="/dashboard/load-provider/orders" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/load-provider/orders' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <ClipboardDocumentCheckIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/load-provider/orders' ? 'text-white' : 'text-primary-700']" />
            My Orders
        </NuxtLink>

        <NuxtLink to="/dashboard/load-provider/payments" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/load-provider/payments' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <CurrencyDollarIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/load-provider/payments' ? 'text-white' : 'text-primary-700']" />
            Payments
        </NuxtLink>

        <NuxtLink to="/dashboard/load-provider/profile" class="group flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="[$route.path === '/dashboard/load-provider/profile' ? 'bg-primary-700 text-white' : 'text-primary-700 hover:bg-primary-700/10']">
            <UserCircleIcon class="mr-3 h-6 w-6" :class="[$route.path === '/dashboard/load-provider/profile' ? 'text-white' : 'text-primary-700']" />
            Profile
        </NuxtLink>
    </nav>
</template> 