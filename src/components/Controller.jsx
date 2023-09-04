import { useEffect, useState } from "react";
import View from "./View";

export const Submission = {
  NONE: 0,
  MATSUYA: 1,
  NISHIMATSUYA: 2,
  DRAW: 3,
};

const Result = {
  NONE: 0,
  CORRECT: 1,
  INCORRECT: 2,
};

function Controller({ mapprops, resetMapFunc }) {
  let [submission, setSubmission] = useState(0);
  let [result, setResult] = useState(Result.NONE);

  useEffect(() => {
    if (submission != Submission.NONE) {
      setResult(
        mapprops.answer == submission ? Result.CORRECT : Result.INCORRECT,
      );
    }
  }, [submission]);

  return (
    <>
      <View props={mapprops} submitted={submission != Submission.NONE}></View>
      <p>範囲内に多いのは</p>
      <button
        onClick={() => {
          if (submission == Submission.NONE) {
            setSubmission(Submission.MATSUYA);
          }
        }}
        disabled={submission != Submission.NONE}
      >
        <div className="circle matsuya_circle" />
        松屋が多い
      </button>
      <button
        onClick={() => {
          if (submission == Submission.NONE) {
            setSubmission(Submission.NISHIMATSUYA);
          }
        }}
        disabled={submission != Submission.NONE}
      >
        <div className="circle nishimatsuya_circle" />
        西松屋が多い
      </button>
      <div>
        {submission != Submission.NONE &&
          (function () {
            switch (result) {
              case Result.CORRECT:
                return <p className="answer">⭕ 正解</p>;
              case Result.INCORRECT:
                return <p className="answer">❌ 不正解</p>;
              default:
                return <></>;
            }
          })()}
        <p>
          {submission != Submission.NONE &&
            (function () {
              switch (mapprops.answer) {
                case Submission.MATSUYA:
                  return <div>松屋が多い</div>;
                case Submission.NISHIMATSUYA:
                  return <div>西松屋が多い</div>;
                default:
                  return <></>;
              }
            })()}
          {submission != Submission.NONE && (
            <div className="detail">
              松屋: {mapprops.filteredMatsuya.length} 西松屋:
              {mapprops.filteredNishimatsuya.length}
            </div>
          )}
        </p>
      </div>
      {submission != Submission.NONE && (
        <button
          onClick={() => {
            resetMapFunc();
            setSubmission(Submission.NONE);
            setResult(Result.NONE);
          }}
        >
          もう一度
        </button>
      )}
    </>
  );
}

export default Controller;
