// -*- Mode: C++; c-basic-offset: 2; indent-tabs-mode: nil -*-
/* Copyright (c) 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The following only applies to changes made to this file as part of YugaByte development.
 *
 * Portions Copyright (c) YugaByte, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied.  See the License for the specific language governing permissions and limitations
 * under the License.
 *
 *
 * ---
 * This file is an internal part spinlock.cc and once.cc
 * It may not be used directly by code outside of //base.
 */

#ifndef YB_GUTIL_SPINLOCK_INTERNAL_H
#define YB_GUTIL_SPINLOCK_INTERNAL_H

#include "yb/gutil/atomicops.h"
#include "yb/gutil/integral_types.h"

namespace base {
namespace internal {

// SpinLockWait() waits until it can perform one of several transitions from
// "from" to "to".  It returns when it performs a transition where done==true.
struct SpinLockWaitTransition {
  int32 from;
  int32 to;
  bool done;
};

// Wait until *w can transition from trans[i].from to trans[i].to for some i
// satisfying 0<=i<n && trans[i].done, atomically make the transition,
// then return the old value of *w.   Make any other atomic tranistions
// where !trans[i].done, but continue waiting.
int32 SpinLockWait(volatile Atomic32 *w, int n,
                   const SpinLockWaitTransition trans[]);
void SpinLockWake(volatile Atomic32 *w, bool all);
void SpinLockDelay(volatile Atomic32 *w, int32 value, int loop);

} // namespace internal
} // namespace base

#endif // YB_GUTIL_SPINLOCK_INTERNAL_H
