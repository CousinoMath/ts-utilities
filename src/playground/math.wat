(module
  (func $isEven_i32 (param $a i32) (result i32)
    ;; Returns 1 when input is even and 0 otherwise
    ;; Sign-agnostic 32-bit integer
    (i32.eqz (i32.and (i32.const 1) (get_local $a)))
  )
  (func $isOdd_i32 (param $a i32) (result i32)
    ;; Returns 1 when input is odd and 0 otherwise
    ;; Sign-agnostic 32-bit integer
    (i32.eqz (i32.xor (i32.const 1) (get_local $a)))
  )
  (func $min_u32 (param $a i32) (param $b i32) (result i32)
    ;; Returns the smallest of two inputs
    ;; Unsigned 32-bit integers
    (if (result i32)
      (i32.le_u (get_local $a) (get_local $b))
      (then (get_local $a))
      (else (get_local $b))
    )
  )
  (func $max_u32 (param $a i32) (param $b i32) (result i32)
    ;; Returns the largest of two inputs
    ;; Unsigned 32-bit integers
    (if (result i32)
      (i32.ge_u (get_local $a) (get_local $b))
      (then (get_local $a))
      (else (get_local $b))
    )
  )
  (func $min_s32 (param $a i32) (param $b i32) (result i32)
    ;; Returns the smallest of two inputs
    ;; Signed 32-bit integers
    (if (result i32)
      (i32.le_s (get_local $a) (get_local $b))
      (then (get_local $a))
      (else (get_local $b))
    )
  )
  (func $max_s32 (param $a i32) (param $b i32) (result i32)
    ;; Returns the smallest of two inputs
    ;; Unsigned 32-bit integers
    (if (result i32)
      (i32.ge_s (get_local $a) (get_local $b))
      (then (get_local $a))
      (else (get_local $b))
    )
  )
  (func $incr_i32 (param $a i32) (result i32)
    ;; Increments the input by 1
    ;; Sign-agnostic 32-bit integer
    (i32.add (i32.const 1) (get_local $a))
  )
  (func $decr_i32 (param $a i32) (result i32)
    ;; Decrements the input by 1
    ;; Sign-agnostic 32-bit integer
    (i32.sub (get_local $a) (i32.const 1))
  )
  (func $neg_s32 (param $a i32) (result i32)
    ;; Negates the input
    ;; Signed 32-bit integer
    (i32.mul (i32.const -1) (get_local $a))
  )
  (func $abs_s32 (param $a i32) (result i32)
    ;; Returns the absolute value of the input
    ;; Signed 32-bit integer
    (if (result i32)
      (i32.ge_s (get_local $a) (i32.const 0))
      (then (get_local $a))
      (else (call $neg_s32 (get_local $a)))
    )
  )
  (func $sign_s32 (param $a i32) (result i32)
    ;; Returns 0 when input is zero, 1 when positive, and -1 otherwise
    ;; Signed 32-bit integer
    (if (i32.eqz (get_local $a)) (return (i32.const 0)))
    (if (i32.gt_s (get_local $a) (i32.const 0)) (return (i32.const 1)))
    (return (i32.const -1))
  )
  (func $sign_f64 (param $x f64) (result i32)
    (if (f64.gt (get_local $x) (f64.const 0)) (return (i32.const 1)))
    (if (f64.lt (get_local $x) (f64.const 0)) (return (i32.const -1)))
    (return (i32.const 0))
  )
  (func $sign_f32 (param $x f32) (result i32)
    (if (f32.gt (get_local $x) (f32.const 0)) (return (i32.const 1)))
    (if (f32.lt (get_local $x) (f32.const 0)) (return (i32.const -1)))
    (return (i32.const 0))
  )
  (func $gcd_u32 (param $a i32) (param $b i32) (result i32)
    ;; Returns the greatest common divisor of two inputs
    ;; Unsigned 32-bit integers
    (local $shift i32)
    (local $temp i32)
    (if (i32.eqz (get_local $a)) (return (get_local $b)))
    (if (i32.eqz (get_local $b)) (return (get_local $a)))
    (set_local $shift (i32.ctz (get_local $a)))
    (set_local $a (i32.shr_u (get_local $a) (get_local $shift)))
    (set_local $temp (i32.ctz (get_local $b)))
    (set_local $b (i32.shr_u (get_local $b) (get_local $temp)))
    (set_local $shift (call $min_u32 (get_local $shift) (get_local $temp)))
    (block
      (loop
        (set_local $b (i32.shr_u (get_local $b) (i32.ctz (get_local $b))))
        (if (i32.gt_u (get_local $a) (get_local $b))
          (set_local $temp (get_local $a))
          (set_local $a (get_local $b))
          (set_local $b (get_local $temp))
        )
        (set_local $b (i32.sub (get_local $b) (get_local $a)))
        (br_if 1 (i32.eqz (get_local $b)))
        (br 0)
      )
    )
    (i32.shl (get_local $a) (get_local $shift))
  )
  (func $extendedGCD_u32 (param $a i32) (param $b i32) (param $g_offset i32) (param $x_offset i32) (param $y_offset i32)
    ;; Returns the greatest common divisor of two inputs
    ;; Unsigned 32-bit integers
    (local $shift i32)
    (local $temp i32)
    (local $x i32)
    (local $y i32)
    ;; Deal with degenerate cases of $a = 0 or $b = 0
    (if (i32.eqz (get_local $a))
      (i32.store (get_local $g_offset) (get_local $b))
      (i32.store (get_local $x_offset) (i32.const 0))
      (i32.store (get_local $y_offset) (i32.const 1))
    )
    (if (i32.eqz (get_local $b))
      (i32.store (get_local $g_offset) (get_local $a))
      (i32.store (get_local $x_offset) (i32.const 1))
      (i32.store (get_local $y_offset) (i32.const 0))
    )
    ;; Divide of common factors of 2
    (set_local $shift (call $min_u32 (i32.ctz (get_local $a)) (i32.ctz (get_local $b))))
    (set_local $a (i32.shr_u (get_local $a) (get_local $shift)))
    (set_local $b (i32.shr_u (get_local $b) (get_local $shift)))
    ;; Divide off extra factors of 2 from $a, shifting them to $x
    (set_local $temp (i32.ctz (get_local $a)))
    (set_local $a (i32.shr_u (get_local $a) (get_local $temp)))
    (set_local $x (i32.shl (i32.const 1) (get_local $temp)))
    (block
      (loop
        ;; Invariants:
        ;;   * $a is odd
        ;;   * $a $x + $b $y is constant
        (set_local $temp (i32.ctz (get_local $b)))
        (set_local $b (i32.shr_u (get_local $b) (get_local $temp)))
        (set_local $y (i32.shl (get_local $y) (get_local $temp)))
        (if (i32.gt_u (get_local $a) (get_local $b))
          ;; $a $x + $b $y = $b $y + $a $x
          (set_local $temp (get_local $a))
          (set_local $a (get_local $b))
          (set_local $b (get_local $temp))
          (set_local $temp (get_local $x))
          (set_local $x (get_local $y))
          (set_local $y (get_local $temp))
        )
        ;; $a $x + $b $y
        ;;   = $a ($x + 1) + ($b - $a) $y - $a + $a $y
        ;;   = $a ($x + 1) + ($b - $a) ($y - $a (1 - $y) / ($b - $a))
        (set_local $b (i32.sub (get_local $b) (get_local $a)))
        (set_local $x (call $incr_i32 (get_local $x)))
        (set_local $temp (i32.div_s (get_local $a) (get_local $b)))
        (set_local $temp (i32.mul (get_local $temp) (i32.sub (i32.const 1) (get_local $y))))
        (set_local $y (i32.sub (get_local $y) (get_local $temp)))
        (br_if 1 (i32.eqz (get_local $b)))
        (br 0)
      )
    )
    (i32.shl (get_local $a) (get_local $shift))
    (i32.store (get_local $g_offset) (get_local $a))
    (i32.store (get_local $x_offset) (get_local $x))
    (i32.store (get_local $y_offset) (get_local $y))
  )
)