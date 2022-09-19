import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, paymentVerification } from "../../redux/actions/order";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../redux/store";

const ConfirmOrder = () => {
  // shippingInfo,
  //   orderItems,
  //   paymentMethod,
  //   itemsPrice,
  //   taxPrice,
  //   shippingCharges,
  //   totalAmount,

  const [paymentMethod, setPaymentMethod] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, subTotal, tax, shippingCharges, total, shippingInfo } =
    useSelector((state) => state.cart);
  const { message, error } = useSelector((state) => state.order);

  const submitHandler = async (e) => {
    e.preventDefault();
    setDisableBtn(true);

    if (paymentMethod === "COD") {
      dispatch(
        createOrder(
          shippingInfo,
          cartItems,
          paymentMethod,
          subTotal,
          tax,
          shippingCharges,
          total
        )
      );
    } else {
      // createorderonline

      const {
        data: { order, orderOptions },
      } = await axios.post(
        `${server}/createorderonline`,
        {
          shippingInfo,
          orderItems: cartItems,
          paymentMethod,
          itemsPrice: subTotal,
          taxPrice: tax,
          shippingCharges,
          totalAmount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const options = {
        key: "rzp_test_RvbyUfMdfeVPIE",
        amount: order.amount,
        currency: "INR",
        name: "MBA Burger Wala",
        description: "Burger App",
        order_id: order.id,
        handler: function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          dispatch(
            paymentVerification(
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              orderOptions
            )
          );
        },

        theme: {
          color: "#9c003c",
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    }
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
      dispatch({ type: "emptyState" });
      navigate("/paymentsuccess");
    }
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
      setDisableBtn(false);
    }
  }, [dispatch, message, error, navigate]);

  return (
    <section className="confirmOrder">
      <main>
        <h1>Confirm Order</h1>

        <form onSubmit={submitHandler}>
          <div>
            <label>Cash On Delivery</label>
            <input
              type="radio"
              name="payment"
              onChange={() => setPaymentMethod("COD")}
              required
            />
          </div>
          <div>
            <label>Online</label>
            <input
              type="radio"
              required
              name="payment"
              onChange={() => setPaymentMethod("Online")}
            />
          </div>

          <button disabled={disableBtn} type="submit">
            Place Order
          </button>
        </form>
      </main>
    </section>
  );
};

export default ConfirmOrder;
