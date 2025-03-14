import React from 'react';
import {
  TbSquareRoundedMinus,
  TbSquareRoundedPlusFilled
} from 'react-icons/tb';
import { RiDeleteBin6Fill } from 'react-icons/ri';

export default function CartItem({
  product,
  product: { id, image, title, option, color, size, price, quantity }
}) {
  const handleMinus = () => {};
  const handlePlus = () => {};
  const handleDelete = () => {};

  return (
    <li>
      <img src={image} alt={title} />
      <p>{title}</p>
      <p>{color}</p>
      <p>{size}</p>
      <div>
        <TbSquareRoundedMinus onClick={handleMinus} />
        <span>{quantity}</span>
        <TbSquareRoundedPlusFilled onClick={handlePlus} />
        <RiDeleteBin6Fill onClick={handleDelete} />
      </div>
    </li>
  );
}
