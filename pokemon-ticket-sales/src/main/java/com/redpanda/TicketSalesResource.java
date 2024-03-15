package com.redpanda;

import jakarta.ws.rs.POST;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import com.redpanda.TicketSale;

@Path("/tickets")
public class TicketSalesResource {

    private static final AtomicLong totalSalesDollars = new AtomicLong(0);
    private static final AtomicLong fees = new AtomicLong(0);
    private static final AtomicInteger totalTicketSales = new AtomicInteger(0);
    private static final ConcurrentHashMap<String, Integer> paymentMethodCounts = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, Integer> deviceTypeCounts = new ConcurrentHashMap<>();
    private static final List<String> seatsSold = new ArrayList<>();
    @POST
    public void addTicketSale(TicketSale sale) {

        System.out.print(".");

        

        totalSalesDollars.addAndGet((long) sale.getFinalPrice());
        fees.addAndGet((long) sale.getFee());
        seatsSold.add(sale.getSeatNumber());
        totalTicketSales.incrementAndGet();
        paymentMethodCounts.merge(sale.getPaymentMethod(), 1, Integer::sum);
        deviceTypeCounts.merge(sale.getDeviceType(), 1, Integer::sum);


    }

    @GET
    @Path("/total-sales")
    public long getTotalSalesDollars() {
        return totalSalesDollars.get();
    }
    @GET
    @Path("/fees")
    public long getFees() {
        return fees.get();
    }

    @GET
    @Path("/total-ticket")
    public int getTotalTicketSales() {
        return totalTicketSales.get();
    }

    @GET
    @Path("/seats-sold")
    public List<String> getTicketsSold() {
        return seatsSold;
    }

    @GET
    @Path("/payment-method-counts")
    public Map<String, Integer> getPaymentMethodCounts() {
        return paymentMethodCounts;
    }

    @GET
    @Path("/device-type-counts")
    public Map<String, Integer> getDeviceTypeCounts() {
        return deviceTypeCounts;
    }
}