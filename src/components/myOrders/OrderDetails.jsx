import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../../redux/actions/order";
import Loader from "../layout/Loader";

const OrderDetails = () => {
  const params = useParams();

  const { order, loading } = useSelector((state) => state.orders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderDetails(params.id));
  }, [params.id, dispatch]);

  return (
    <section className="orderDetails">
      {loading === false && order !== undefined ? (
        <main>
          <h1>Order Details</h1>
          <div>
            <h1>Shipping</h1>
            <p>
              <b>Address</b>
              {`${order.shippingInfo.hNo} ${order.shippingInfo.city} ${order.shippingInfo.state} ${order.shippingInfo.country} ${order.shippingInfo.pinCode}`}
            </p>
          </div>
          <div>
            <h1>Contact</h1>
            <p>
              <b>Name</b>
              {order.user.name}
            </p>
            <p>
              <b>Phone</b>
              {order.shippingInfo.phoneNo}
            </p>
          </div>

          <div>
            <h1>Status</h1>
            <p>
              <b>Order Status</b>
              {order.orderStatus}
            </p>
            <p>
              <b>Placed At</b>
              {order.createdAt.split("T")[0]}
            </p>
            <p>
              <b>Delivered At</b>
              {order.deliveredAt ? order.deliveredAt.split("T")[0] : "NA"}
            </p>
          </div>

          <div>
            <h1>Payment</h1>
            <p>
              <b>Payment Method</b>
              {order.paymentMethod}
            </p>
            <p>
              <b>Payment Reference</b>
              {order.paymentMethod === "Online"
                ? `#${order.paymentInfo}`
                : "NA"}
            </p>
            <p>
              <b>Paid At</b>
              {order.paymentMethod === "Online"
                ? order.paidAt.split("T")[0]
                : "NA"}
            </p>
          </div>

          <div>
            <h1>Amount</h1>
            <p>
              <b>Items Total</b>₹{order.itemsPrice}
            </p>
            <p>
              <b>Shipping Charges</b>₹{order.shippingCharges}
            </p>
            <p>
              <b>Tax</b>₹{order.taxPrice}
            </p>
            <p>
              <b>Total Amount</b>₹{order.totalAmount}
            </p>
          </div>

          <article>
            <h1>Ordered Items</h1>
            <div>
              <h4>Cheese Burger</h4>
              <div>
                <span>{order.orderItems.cheeseBurger.quantity}</span> x{" "}
                <span>{order.orderItems.cheeseBurger.price}</span>
              </div>
            </div>
            <div>
              <h4>Veg Cheese Burger</h4>
              <div>
                <span>{order.orderItems.vegCheeseBurger.quantity}</span> x{" "}
                <span>{order.orderItems.vegCheeseBurger.price}</span>
              </div>
            </div>
            <div>
              <h4>Burger Fries</h4>
              <div>
                <span>{order.orderItems.burgerWithFries.quantity}</span> x{" "}
                <span>{order.orderItems.burgerWithFries.price}</span>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontWeight: 800,
                }}
              >
                Sub Total
              </h4>
              <div
                style={{
                  fontWeight: 800,
                }}
              >
                ₹{order.itemsPrice}
              </div>
            </div>
          </article>
        </main>
      ) : (
        <Loader />
      )}
    </section>
  );
};

export default OrderDetails;
